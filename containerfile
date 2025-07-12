FROM mcr.microsoft.com/playwright:v1.53.2-noble

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y build-essential gh less nginx ripgrep screen unzip zsh && \
    apt-get clean

RUN npm install --global corepack

RUN corepack prepare pnpm@10.4.1 yarn@4.4.1 --activate

# neovim

RUN curl -sfLO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz && \
    tar -C /opt -xzf nvim-linux-x86_64.tar.gz && \
    ln -s /opt/nvim-linux-x86_64/bin/nvim /usr/local/bin && \
    rm nvim-linux-x86_64.tar.gz

#

RUN usermod -s /bin/zsh root

WORKDIR /root

# zshrc

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# lazyvim

RUN git clone https://github.com/LazyVim/starter .config/nvim

RUN echo 'vim.o.shell = "zsh"' >> .config/nvim/lua/config/options.lua

COPY lazyvim.json .config/nvim/

RUN nvim --headless "+Lazy! sync" +qa

#

COPY daemon .local/bin/

COPY known_hosts .ssh/

COPY omz.zsh .oh-my-zsh/custom/

CMD exec .local/bin/daemon
