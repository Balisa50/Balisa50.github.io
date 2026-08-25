# Deploy to a VPS with Coolify in five minutes

> Written while doing it, for someone who has only ever deployed by connecting a GitHub repository to a platform. Five minutes is the hands-on time. The DNS wait is not included and is the part that will actually make you impatient.

## What you need before you start

- A GitHub account with this repository pushed to it.
- A domain, or the willingness to use the droplet's IP address for now. The IP works. HTTPS will not.
- About 12 US dollars a month. There is a cheaper path at the bottom that costs nothing, and it is a legitimate way to run this site while you decide.

## 1. Create the droplet

On DigitalOcean, create a droplet with these settings. The equivalents on Hetzner, Vultr or Linode work the same way and cost less.

- Image: Ubuntu 24.04 LTS
- Plan: Basic, regular SSD, 2 GB memory and 1 vCPU
- Region: whichever is closest to the people who will read the site
- Authentication: SSH key, not a password

Two GB is the honest minimum. The 1 GB droplet costs 6 dollars and will run this container happily once it is built, but Coolify builds on the box, and a Next.js build inside 1 GB needs swap and still gets killed often enough to make you miserable. If you want to try anyway, add swap first:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 2. Point DNS at it, now rather than later

Before installing anything, add two A records at your registrar:

| Type | Name     | Value            |
| ---- | -------- | ---------------- |
| A    | `@`      | your droplet IP  |
| A    | `status` | your droplet IP  |

Do this first because propagation takes anywhere from two minutes to an hour, and it will finish while you do the rest. The `status` record is for the Uptime Kuma dashboard in step 6.

## 3. Install Coolify

SSH in as root and run the installer. It is one command and it takes two to three minutes:

```bash
ssh root@YOUR_DROPLET_IP
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

That installs Docker, Docker Compose, Coolify itself and a Traefik proxy. When it finishes it prints the dashboard URL, which is `http://YOUR_DROPLET_IP:8000`.

Open it and create the admin account immediately. That first account is claimed by whoever reaches the page first, so do not walk away between the install finishing and you registering.

## 4. Connect GitHub

In the Coolify dashboard, go to **Sources** and add GitHub. Coolify walks you through creating a GitHub App, which is worth doing properly rather than pasting a personal access token: the App gets access to the repositories you choose and nothing else, and it is what gives you automatic redeploys on push.

Install the App on this repository when GitHub asks which ones it may access.

## 5. Deploy the site

**Projects** → **New Project** → **Add Resource** → **Private Repository (with GitHub App)**, then pick the repository and the `main` branch.

The only settings that matter:

| Setting          | Value        | Why                                                              |
| ---------------- | ------------ | ---------------------------------------------------------------- |
| Build pack       | `Dockerfile` | Not Nixpacks. The Dockerfile in this repo already does the right thing, and Nixpacks will guess at it. |
| Dockerfile path  | `Dockerfile` | Repository root.                                                 |
| Port             | `3000`       | Must match `EXPOSE` and the `PORT` env in the Dockerfile.        |
| Domain           | `https://yourdomain.com` | With the scheme. Coolify reads it to configure Traefik and to request the certificate. |

Then press Deploy and watch the log stream. The first build takes three to six minutes on a 2 GB box, mostly `npm ci`. Subsequent builds are faster because the dependency layer is cached, which is the entire reason the Dockerfile copies `package.json` before it copies the rest of the repository.

You do not need any environment variables. Every value in `.env.example` is optional and the site has a documented fallback for each one.

## 6. Add monitoring

**Add Resource** → **Service** → **Uptime Kuma**. Set its domain to `https://status.yourdomain.com`, deploy, and open it.

Inside Uptime Kuma, add one HTTP monitor per site you want watched, at a 60 second interval. Then create a status page and make it public. That public page is what lets the infrastructure page on this site report real uptime instead of the single-request reachability check it falls back to today.

When it is running, set `UPTIME_KUMA_URL` in the portfolio resource's environment tab, and flip `state` in `data/infra.json` from `provisioning` to `live`.

## 7. Confirm it actually works

```bash
curl -I https://yourdomain.com
```

You want a `200` and a `strict-transport-security` header. If you get a 502, the container is up but Traefik cannot reach it, and the cause is almost always a port mismatch in step 5.

Push a commit to `main` and watch Coolify rebuild without you touching anything. That is the loop:

```
git push  →  webhook  →  docker build  →  health check  →  traffic swaps
```

The old container is stopped rather than deleted, so **Rollback** in the deployment list is one click and takes about as long as a restart.

## When it goes wrong

**The build is killed with no error message.** Out of memory. Add swap as in step 1, or build the image somewhere else and push it to a registry.

**502 Bad Gateway.** The port in Coolify does not match the port the container listens on. It is 3000 here.

**The certificate never arrives.** DNS has not propagated, or the A record points somewhere else. Check with `dig +short yourdomain.com` from the droplet itself. Let us Encrypt validates over HTTP on port 80, so that port has to stay open.

**Everything is slow after a few weeks.** Old images. `docker system prune -a` on the droplet, and turn on Coolify's automatic cleanup.

## The version that costs nothing

The droplet is real money on a student budget, and this repository is built so you do not have to spend it to have the site online.

**Vercel.** Import the repository, accept every default, done. Route handlers and revalidation both work, so the site is feature-complete there. It is free for personal use, and the only thing you lose is the ability to say you run your own infrastructure.

**GitHub Pages.** Already wired up in `.github/workflows`. It runs:

```bash
npm run build:static
```

which sets `NEXT_OUTPUT=export` and writes static HTML to `out/`. There is no server, so the live probe on each project page falls back to the measurement committed in `data/metrics-snapshot.json` and shows the date it was taken. Refresh it whenever you like:

```bash
node scripts/probe.mjs
```

Run both. Two free copies of the site staying online while the droplet is a plan rather than a bill is not a compromise, it is the same argument the projects on this site make about working inside constraints.
