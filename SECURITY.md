# Security Policy

**Project:** `moataz-portfolio-v4`
**Owner:** Moataz Mohamed ([@moatazsmohamed](https://github.com/moatazsmohamed))
**Fingerprint:** `e8fa428b72fc0e43a2632e36723784d1`

---

## Reporting a Vulnerability

If you believe you have found a security vulnerability in this project, please report it
**privately**. Do not open a public issue, and do not disclose the details publicly before
a fix has been released.

### Preferred channel — GitHub Private Vulnerability Reporting

Open a private advisory for this repository:

**https://github.com/moatazsmohamed/moataz-portfolio-v4/security/advisories/new**

This is the fastest and most secure route: the report stays private between you and the
maintainer, and it is tracked until it is resolved.

### Alternative channel — Email

**mtzm2225@gmail.com**

Please include, as far as you can:

- A description of the vulnerability and its impact
- The exact steps to reproduce it (proof-of-concept, request/response, or screenshots)
- The affected version, commit hash, or URL
- Any suggested remediation
- How you would like to be credited (or if you prefer to stay anonymous)

Please **do not** include live credentials, personal data, or third-party data in your report.

---

## What to Expect

| Stage | Target |
| --- | --- |
| Acknowledgement of your report | within **3 business days** |
| Initial assessment and severity triage | within **7 business days** |
| Fix or mitigation plan communicated | within **14 business days** |
| Public disclosure | coordinated with you, after a fix is available |

If a report is accepted, you will be credited in the release notes unless you ask to remain
anonymous. If a report is declined, you will receive a written explanation of why.

## Scope

**In scope**

- This repository's source code and configuration
- Any deployment of this project that the owner controls

**Out of scope**

- Vulnerabilities in third-party dependencies — please report those upstream
  (Dependabot alerts are enabled on this repository)
- Denial-of-service by brute force or volumetric traffic
- Reports produced solely by an automated scanner with no demonstrated impact
- Social engineering, physical access, or attacks against the owner's accounts

## Safe Harbour

Good-faith security research on this project is welcome. If you make a genuine effort to
avoid privacy violations, data destruction, and service interruption, and you report what
you find through the channels above, the owner will not pursue legal action against you.

Please do not:

- Access, modify, or exfiltrate data that is not yours
- Degrade the service for other users
- Use a vulnerability for anything other than demonstrating it privately

## Supported Versions

This project is maintained on the `main` branch. Security fixes are applied to `main`;
older commits and tags are not separately supported.

---

## Ownership

This project is the work of **Moataz Mohamed** and is protected by the ownership notice in
[`NOTICE`](./NOTICE). The fingerprint above is derived from the owner's identity and is
reproducible — see `NOTICE` for the verification command.

---

*This policy follows the [GitHub security policy](https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/adding-a-security-policy-to-your-repository)
convention and is referenced by [`.well-known/security.txt`](./.well-known/security.txt)
([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)).*
