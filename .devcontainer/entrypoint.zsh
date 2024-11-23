#!/usr/bin/env zsh


workspace=/root/cruftbusters.com
ln -sf $workspace/.config /root/.config
ln -sf $workspace/.devcontainer/nginx.conf /etc/nginx/nginx.conf

nginx

git config --global core.editor nvim
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true

git clone git@github.com:cruftbusters/cruftbusters.com.git $workspace
cd $workspace
pnpm -r install

screen -d -m -S home-dev pnpm -F home dev
screen -d -m -S home-test pnpm -F home exec vitest --ui --api 5174
screen -d -m -S home-e2e pnpm -F home exec playwright test --ui --ui-port 5175

/bin/zsh
