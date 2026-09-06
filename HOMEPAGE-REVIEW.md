# Homepage design review — September 5, 2026

## Scope and direction

The Blue Line Advisors homepage serves prospective families who want to understand Pete Cecil's approach and arrange an introductory conversation. The existing family photograph, founder portrait, truthful practice information, and contact destinations are the source material.

Applied the user-requested `elevate-web-design` skill and its art-direction and visual-review references. The final composition uses a cream page, cobalt actions and compact footer, locally hosted DM Sans display type, and Newsreader for the personal letter. The centered letter and portrait interrupt the broader opening and contact columns. On mobile, Pete's portrait and full name introduce the letter.

This work continues the recovered `design/astra-refinement` branch. It preserves the existing inventory page, configuration and analytics scripts, original image assets, booking destination, phone, email, LinkedIn, and relevant homepage metadata. No dependencies or fabricated imagery were added.

## Independent visual review

Each desktop critic ran in a fresh Astra context with only a newly captured 1440px-wide screenshot and the unchanged critic prompt from the local recovery workspace's `design-review.md`. Critics were not told prior scores, implementation decisions, or a desired score.

- First review: **6.5/10**. Main concerns were a familiar split-page composition, a founder portrait too small to establish identity, dense prose, and a dominant blue closing area.
- Second review: **7/10**. The portrait and prose changes improved the result. Repeated split layouts and the oversized blue closing area remained the strongest concerns.
- Final review: **7.4/10**. The critic praised restraint and the authentic hero image, while identifying remaining opportunities in distinctive composition, the relationship between typefaces and photographs, and the compact blue footer. The earlier 9/10 target is **not achieved**.
- A separate mobile review identified late founder identification, dense prose, and small supporting text. The final version introduces Pete before the letter, shortens the opening paragraphs, and increases supporting text size and contrast.
- Follow-up mobile review of the final screenshot: **no important readability or composition issue remained visible**; booking, phone, and email paths were clearly separated and prominent. This visual finding does not substitute for the interaction checks below.

The final refinement centers a narrower letter beside the portrait, uses the reading serif for its heading, brings launch details beside the opening invitation, simplifies decorative marks, and moves the contact invitation onto cream. Blue remains on the booking control and a compact footer. The original family photograph remains unchanged: a substantially wider crop would lose important parts of the people and setting, and a different environmental portrait is not an available verified asset.

## Verification

- `npm run build`: passed. Existing Vercel analytics script bundling warnings remain.
- Production browser checks: passed at 320, 390, 768, 1024, 1440, and 1920px; no horizontal overflow, broken images, missing anchor targets, or page errors. Contact navigation and the inventory route passed.
- Additional checks: passed at 560, 760, 820, and 1280px; actual local font loading, keyboard skip-link focus, contact scrolling, booking popup destination, phone and email links, and reduced-motion behavior passed. The external booking request was intercepted locally; no appointment was booked.
- Desktop, mobile, and tablet captures were visually inspected after the final changes.
- The 18 existing JavaScript tests passed earlier in the recovery work. The tested JavaScript has not changed in this refinement.
- `git diff --check`: passed.

## Recovery and preview

Run `npm run dev -- --host 127.0.0.1` for development. For the verified production preview, run `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`.

The local recovery workspace preserves the previous versions as `../elevate-reviewed-65.html`, `../elevate-reviewed-65.css`, `../elevate-reviewed-70.html`, and `../elevate-reviewed-70.css`, with corresponding desktop screenshots. Earlier numbered revisions and the original recovered baseline remain untouched. The current rendered views are `../elevate-commit-preview-desktop.png`, `../elevate-commit-preview-mobile.png`, and `../tablet-design.png`.

Publishing requires the user's approval of this preview under the agreed workflow. No deployment is part of this commit.
