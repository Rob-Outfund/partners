import React from "react";
import { graphql, navigate } from "gatsby";

import styled from "styled-components";
import type { HeadFC, PageProps } from "gatsby";
import { Formik } from "formik";
import * as yup from "yup";

import { ChakraProvider } from "@chakra-ui/react";
import { Input } from "./../../components/Form";
import { ContentWrapper, Button } from "./../../components/Atoms";

const encode = (data: any) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export const Head: HeadFC = (props: any) => (
  <>
    <title>
      {props.data.mdx.frontmatter.slug.charAt(0).toUpperCase() +
        props.data.mdx.frontmatter.slug.slice(1)}
      {" | "}
      Apply
    </title>
  </>
);

const ApplyPage: React.FC<PageProps> = (props) => {
  const svgDir = require.context("!@svgr/webpack!./../../images/partnerLogos/");

  let OutfundLogo;
  let PartnerLogo;

  if (props.data.mdx.frontmatter.partnerLogo) {
    PartnerLogo = svgDir(
      //@ts-ignore
      `./${props.data.mdx.frontmatter.partnerLogo}`
    ).default;
  }
  if (props.data.mdx.frontmatter.outfundLogo) {
    OutfundLogo = svgDir(
      //@ts-ignore
      `./${props.data.mdx.frontmatter.outfundLogo}`
    ).default;
  }

  return (
    <StyledApplyPage {...props.data.mdx.frontmatter}>
      <ChakraProvider>
        <div className="topbar">
          <div className="logo">
            {props.data.mdx.frontmatter.outfundLogo && (
              <div className="ofl">
                <OutfundLogo />
              </div>
            )}
            {props.data.mdx.frontmatter.outfundLogo &&
              props.data.mdx.frontmatter.partnerLogo && <div>+</div>}

            {props.data.mdx.frontmatter.partnerLogo && (
              <div className="ptl">
                <PartnerLogo />
              </div>
            )}
          </div>
        </div>
        <ContentWrapper>
          <div className="content">
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                website: "",
                country: "",
                amr: "",
              }}
              validationSchema={yup.object({
                firstName: yup
                  .string()
                  .max(15, "Must be 15 characters or less")
                  .required("Required"),
                lastName: yup
                  .string()
                  .max(20, "Must be 20 characters or less")
                  .required("Required"),
                email: yup
                  .string()
                  .email("Invalid email address")
                  .required("Required"),
                phone: yup
                  .string()
                  .max(20, "Must be 20 numbers or less")
                  .required("Required"),
                website: yup.string().required("Required"),
                country: yup
                  .string()
                  .max(56, "Must be 20 numbers or less")
                  .required("Required"),
                amr: yup.number().required("Required"),
              })}
              onSubmit={(values, actions) => {
                fetch("/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body: encode({ "form-name": "partnerForm", ...values }),
                })
                  .then(() => {
                    // alert("Success");
                    // actions.resetForm();
                    navigate("/thank-you/", {
                      state: { ...props.data.mdx.frontmatter },
                    });
                  })
                  .catch(() => {
                    alert("Error");
                  })
                  .finally(() => actions.setSubmitting(false));
              }}
            >
              {(formik) => (
                <form
                  name="partnerForm"
                  onSubmit={formik.handleSubmit}
                  netlify-honeypot="bot-field"
                  data-netlify="true"
                >
                  <div className="hidden">
                    <input type="hidden" name="form-name" value="partnerForm" />
                  </div>
                  <div className="firstLast">
                    <Input label="First Name" name="firstName" type="text" />

                    <Input label="Last Name" name="lastName" type="text" />
                  </div>

                  <Input label="Business email" name="email" type="email" />
                  <Input
                    label="Business phone number"
                    name="phone"
                    type="tel"
                  />
                  <Input label="Business website" name="website" type="text" />
                  <Input
                    label="Incorporation Country"
                    name="country"
                    type="text"
                  />
                  <Input
                    label="Average Monthly Revenue (in your local currency)"
                    name="amr"
                    type="number"
                  />
                  <div className="hidden">
                    <label>
                      Dontt fill this out if youtre human:{" "}
                      <input name="bot-field" />
                    </label>
                  </div>

                  {/* @ts-expect-error Server Component */}
                  <Button
                    btnbgcolor={props.data.mdx.frontmatter.color.btnBG}
                    btntextcolor={props.data.mdx.frontmatter.color.btnText}
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              )}
            </Formik>
          </div>
        </ContentWrapper>
      </ChakraProvider>
    </StyledApplyPage>
  );
};

export default ApplyPage;

const StyledApplyPage = styled.div<any>`
  background-color: #fafafa;
  min-height: 101vh;
  .topbar {
    background-color: ${({ topBar }) => topBar.background};
    display: flex;
    align-items: center;
    /* justify-content: center; */
    height: ${({ topBar }) => topBar.height};
    box-shadow: rgba(5, 24, 64, 0.07) 0px 17px 33px,
      rgba(5, 24, 64, 0.05) 0px 3.8002px 13.45px,
      rgba(5, 24, 64, 0.04) 0px 1.07885px 7.14579px;
  }
  .hidden {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  .logo {
    display: flex;
    gap: 24px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    svg {
      height: ${({ topBar }) => topBar.logoHeight};
    }
  }
  .content {
    max-width: 600px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 64px;
    .firstLast {
      display: flex;
      gap: 24px;
    }
  }
`;

export const query = graphql`
  query FormPageQuery($pageId: String) {
    mdx(id: { eq: $pageId }) {
      id
      frontmatter {
        slug
        published
        partnerLogo
        outfundLogo
        color {
          btnBG
          btnText
        }
        topBar {
          background
          height
          logoHeight
        }
      }
    }
  }
`;
