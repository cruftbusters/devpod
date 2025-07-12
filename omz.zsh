#!/usr/bin/env zsh

export ZSH_THEME="aussiegeek"

export EDITOR=nvim

export dgst() {
  find /root -name .git \
    ! -path '*/.local/*' \
    ! -path '*/.config/nvim/*' \
    ! -path '*/.oh-my-zsh/*' \
    -exec bash -c "cd {}/.. > /dev/null ; echo {} ; git status ; cd -" \;
}
