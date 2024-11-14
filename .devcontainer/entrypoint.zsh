#!/usr/bin/env zsh

workspace=/root/cruftbusters.com
ln -sf $workspace/.config /root/.config

git config --global core.editor nvim
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true

git clone git@github.com:cruftbusters/cruftbusters.com.git $workspace
cd $workspace
pnpm -r install
pnpm -F home exec playwright install
pnpm -F home exec playwright install-deps

screen -d -m -S home-dev pnpm -F home dev --host
screen -d -m -S home-e2e pnpm -F home exec playwright test --ui --ui-host 0.0.0.0 --ui-port 5174

/bin/zsh
