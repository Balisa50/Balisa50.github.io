import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Diagram, DiagramLegend } from "@/components/diagram";

export const metadata: Metadata = {
  title: "Balisa Agent",
  description:
    "A voice assistant for Windows that runs entirely on the machine. Vosk wake word, faster-whisper, a local model through Ollama, Piper speech out. No API keys, no cloud calls, and it works with the network cable pulled out."
};

const CAPABILITIES: { say: string; does: string }[] = [
  { say: "Hi Balisa", does: "Wakes, answers \"Yes?\", and starts listening" },
  { say: "Open my CV", does: "Searches Documents, Desktop and Downloads for a match, opens it" },
  { say: "Open the downloads folder", does: "Opens it in Explorer" },
  { say: "Open Notepad", does: "Launches an app from the whitelist" },
  { say: "Play Hotel Transylvania", does: "Searches Videos and Music, plays it in VLC or the default player" },
  { say: "Search for Python tutorials", does: "Opens the browser on a private search" },
  { say: "Look up transformers on Wikipedia", does: "Site-specific search across a few known destinations" },
  { say: "Lock the screen", does: "Locks immediately" }
];

export default function BalisaAgentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Side project"
        title="Balisa, an assistant with no bill attached"
        lede="Every guide to building your own voice assistant ends the same way: sign up, paste in a key, add a card. That is a fine way to demo something and a poor way to own it. This one has no keys in it at all. The wake word, the transcription, the model that decides what to do and the voice that answers are all files on the disk."
      />

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">Where it currently stands</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
            <p>
              The code is written and the setup script has not been run. No models are downloaded
              and Ollama is not installed on this machine yet, so what exists is a complete
              implementation that has not yet spoken a word on my own hardware. Saying otherwise
              would be the easiest lie on this site to tell and the least worth telling.
            </p>
            <p>
              The target box has eight gigabytes of memory and no GPU, which the installer profiles
              as its smallest tier. That constraint is the reason the architecture looks the way it
              does rather than a disclaimer attached to it.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 pb-6 sm:px-10">
        <div className="border-t border-ink pt-8">
          <h2 className="display text-[1.75rem] leading-tight">How it fits together</h2>
        </div>
        <div className="mt-8">
          <Diagram slug="balisa" />
          <DiagramLegend />
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">Why local, specifically</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
            <p>
              A cloud assistant charges in three places on every request: speech in, tokens through
              the model, speech out. At a few cents a call, casual daily use is real money every
              month for something that mostly opens files and reads the clock. This costs one
              download. The models are about 400 MB on disk, and the thousandth command costs
              exactly what the first one cost.
            </p>
            <p>
              The privacy argument is stronger than the cost one. A cloud assistant needs a live
              microphone stream to be useful, which means every word spoken near the machine leaves
              it. Here the audio never leaves the process that recorded it. There is no request to
              audit because there is no request.
            </p>
            <p>
              And it keeps working. No account suspension, no rate limit, no retired model id, no
              pricing change, no service shutting down. The version set up today behaves identically
              in five years, because everything it depends on is already on the disk.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <div className="border-t border-ink pt-8">
          <h2 className="display text-[1.75rem] leading-tight">Two decisions that shaped it</h2>
        </div>

        <div className="mt-6 border-t border-rule">
          <div className="border-b border-rule py-5">
            <p className="text-[1.0625rem] font-medium leading-snug text-ink">
              A rule router in front of the model, not a model for everything.
            </p>
            <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
              Most spoken commands are the same twenty phrases. Sending &ldquo;lock the screen&rdquo;
              through a language model costs a second of latency and a few hundred megabytes of
              resident memory to arrive at an answer a regular expression already had. The router
              answers common commands in about a millisecond and never wakes the model at all. The
              model exists for the long tail, which is where it is actually worth its cost.
            </p>
          </div>
          <div className="border-b border-rule py-5">
            <p className="text-[1.0625rem] font-medium leading-snug text-ink">
              A 40 MB wake word with fuzzy matching, not a 1.5 GB one.
            </p>
            <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
              The wake word runs continuously, so its memory footprint is permanent in a way nothing
              else here is. The small model mishears the phrase constantly, which is handled by
              matching against a list of ten things it actually produces, from &ldquo;hi
              belisa&rdquo; to &ldquo;hi believes a&rdquo;, behind a required greeting prefix so
              ordinary conversation does not trigger it. Accepting a worse model and correcting for
              it in software is cheaper than the model that does not need correcting.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <div className="border-t border-ink pt-8">
          <h2 className="display text-[1.75rem] leading-tight">What it does</h2>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-[0.9375rem]">
            <thead>
              <tr className="border-b border-rule-strong text-left">
                <th className="label pb-2 pr-6 font-normal">Say</th>
                <th className="label pb-2 font-normal">It does</th>
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((row) => (
                <tr key={row.say} className="border-b border-rule align-top">
                  <td className="py-3 pr-6 font-mono text-[0.875rem] text-ink">{row.say}</td>
                  <td className="py-3 leading-relaxed text-text-secondary">{row.does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <figure>
          <div
            className="flex min-h-[16rem] items-center justify-center border border-dashed border-rule-strong bg-surface px-6 text-center"
            role="img"
            aria-label="Placeholder. No screenshot of the running assistant has been taken yet."
          >
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-text-secondary">
              Screenshot goes here once setup has been run and the assistant has answered on this
              machine. There is no mockup in this space on purpose.
            </p>
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-text-secondary">
            Drop the capture at <span className="font-mono text-[0.8125rem]">public/figures/balisa.png</span>{" "}
            and swap this block for the site&rsquo;s figure component.
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="grid gap-10 border-t border-ink pt-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">What it does not do yet</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
            <p>
              There is no speaker verification. The wake word answers to the phrase, not to me,
              which means anyone within range of the microphone can use it. For an assistant that
              opens files and launches applications on a personal machine, that is a real gap rather
              than a nice-to-have, and it is the next thing to build.
            </p>
            <p>
              It is worth being precise about why. A wake word is a trigger, not an authentication
              step, and treating one as the other is a common way to describe a system as more
              secure than it is. Closing this means a speaker embedding model enrolled on my own
              voice and checked before the command is routed, which is another local model and
              another few hundred megabytes on a machine that does not have many to spare.
            </p>
            <p>
              The whitelist is the current mitigation. It can only launch applications named in the
              config file, so the blast radius of a stranger talking to it is bounded, which is not
              the same as being closed.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto grid w-full max-w-shell gap-8 px-6 py-16 sm:px-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">The code</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[0.9375rem] leading-relaxed text-text-secondary">
            <p className="inline-flex items-center gap-2 text-ink">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-mono text-[0.875rem]">Balisa50/balisa</span>
              <span className="text-text-faint">private</span>
            </p>
            <p>
              Not linked, because it is not public and a link that returns a 404 reads as a project
              that was never built. It is a Python package with a batch installer, a configuration
              file that takes Windows path variables, and a startup entry so it comes up with the
              machine. Happy to walk through it directly.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm">
              <Link href="/contact" className="link-underline text-ink">
                Ask me about it
              </Link>
              <Link href="/work" className="link-underline text-text-secondary">
                The eleven that are deployed
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
