# Working together — September 7, 2026

The user approved the prospective-client critique and asked to proceed. This pass makes the relationship easier to understand while preserving the lake, desktop line transformation, original photographs, historical data, research tools and existing working tree.

## Brief and evidence

The live read found a strong personal tone but insufficient detail about the service, a large market chart before the family story on phones, and a technical tour whose tools could overshadow its client purpose. The booking screen was inspected and specifies a 30-minute video introduction for prospective advisory clients. The original homepage confirms retirement planning, attention to investment risk, involving children, direct access to Pete, fifteen founding families and a Fall 2026 opening. These are the boundaries for new copy. Earlier fee-only wording is superseded by DECISIONS.md's June 1 note specifying fee-based advice; no fee-only claim is reintroduced.

A clarification about target clients, fees/minimums and meeting cadence was sent while independent implementation continued. No fee amount, asset/income threshold, recurring meeting schedule, new credential, new tax/estate service, free-call promise or investment outcome was invented. The fee question invites discussing the service and charges. Exact commercial terms remain for Pete to supply. The existing web address and contact destinations remain because no replacement was supplied.

## Implementation

- The opening states retirement planning and a direct advisor relationship. Its primary link goes directly to Working together; the sticky masthead retains contact access.
- Working together explains retirement questions, the purpose behind investment risk, family participation and the direct relationship. It uses the established cream/cobalt palette, local serif/sans fonts and ruled rows.
- Before we meet explains the 30-minute video introduction, conversation topics, preparation, fees as a discussion topic and the distinction between introductory meetings now and the planned Fall 2026 opening. Native details elements keep the questions compact and keyboard accessible.
- The Treasury chart is a native disclosure, initially closed at 760px and below. Desktop opens it and retains the existing continuous scene. The mobile open/closed preference is retained across crossing the desktop breakpoint. Resize and reopening repaint the native SVG at the correct size, retaining selected data.
- Homepage preparation copy explains Pete's review and responsibility; the technical tour is optional. Only the opening explanatory paragraph in inventory.html changed. No specific data-handling guarantee was added.
- New styles are isolated in public/client-clarity.css. No dependency or image generation was added.

## Review and continuity

Rendered self-review covered desktop1440, tablet768 and phones390/320. A redundant second opening action was removed after the first render; this restored clear separation between the phone text and the bright horizon. An enlarged-text overflow in a service heading was corrected. The new section's primary link and contact destinations are checked against the actual sticky header.

Before source is saved in ../../client-clarity-before/. The preceding reviewed renders and the live client read remain the visual baseline. Final evidence is in ../../client-clarity-render.json, ../../client-clarity-{local,live}-check.json and ../../client-clarity-motion-{local,live}-check.json. Existing 47 unit tests pass. See the release notes and HANDOFF for completed live checks and deployment identity. No independent critic or numerical design score is claimed.
