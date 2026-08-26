/**
 * Contact form configuration.
 *
 * ── TO TURN THE FORM ON, EDIT ONE LINE BELOW ───────────────────────────────
 *
 *   1. Go to https://web3forms.com
 *   2. Type your email into the box and press the button. No account, no card.
 *   3. They email you an access key. It looks like:
 *        a1b2c3d4-5e6f-7890-abcd-ef1234567890
 *   4. Paste it between the quotes on the ACCESS_KEY line, then commit and push.
 *
 * That is the whole setup. The form appears on the next deploy.
 *
 * ── WHY THIS IS SAFE TO COMMIT ─────────────────────────────────────────────
 *
 * The key is public by design. It names a destination inbox and grants no read
 * access, so it cannot be used to discover the address it forwards to, or to
 * read anything you have received. It is meant to sit in client-side code.
 *
 * Your email address itself never appears anywhere on the site. That is the
 * entire point of routing through Web3Forms rather than a mailto link.
 *
 * ── WHY IT IS HERE RATHER THAN IN A GITHUB SECRET ──────────────────────────
 *
 * It was a repository secret first. That meant the form was invisible until a
 * value existed in a settings page nobody was looking at, and the site shipped
 * a contact section with no form in it. A committed constant is one line in one
 * file, and you can see whether it is set by reading it.
 *
 * The environment variable still wins if it is set, so the secret keeps working
 * for anyone who prefers it.
 */

/** Paste your Web3Forms access key between the quotes. */
const ACCESS_KEY = "";

/** Env var overrides the constant, so a repository secret still works. */
export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ACCESS_KEY;

export const CONTACT_CONFIGURED = WEB3FORMS_KEY.length > 0;
