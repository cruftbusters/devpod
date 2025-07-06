FROM mcr.microsoft.com/playwright:v1.53.1-noble

RUN apt-get update

RUN apt-get upgrade -y

RUN apt-get install -y build-essential less ripgrep unzip zsh

RUN apt-get clean

RUN npm install --global corepack

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

RUN sed -i 's/robbyrussell/aussiegeek/' .zshrc

RUN echo EDITOR=nvim >> .zshrc

# lazyvim

RUN git clone https://github.com/LazyVim/starter .config/nvim

RUN echo 'vim.o.shell = "zsh"' >> .config/nvim/lua/config/options.lua

COPY lazyvim.json .config/nvim/

RUN nvim --headless "+Lazy! sync" +qa

#

COPY known_hosts .ssh/

COPY daemon .local/bin/

CMD exec .local/bin/daemon
