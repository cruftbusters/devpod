FROM mcr.microsoft.com/playwright:v1.53.1-noble

RUN apt-get update

RUN apt-get upgrade -y

RUN apt-get install -y build-essential less nginx screen unzip zsh

RUN apt-get clean

RUN npm install --global corepack

RUN usermod -s /bin/zsh root

# oh-my-zsh

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

RUN sed -i 's/robbyrussell/aussiegeek/' /root/.zshrc

# neovim

RUN curl -sfLO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz

RUN tar -C /opt -xzf nvim-linux-x86_64.tar.gz && \
    rm nvim-linux-x86_64.tar.gz && \
    ln -s /opt/nvim-linux-x86_64/bin/nvim /usr/local/bin

RUN echo EDITOR=nvim >> /root/.zshrc

# lazyvim

RUN git clone https://github.com/LazyVim/starter /root/.config/nvim

RUN echo 'vim.o.shell = "zsh"' >> /root/.config/nvim/lua/config/options.lua

RUN nvim --headless "+Lazy! sync" +qa

# entrypoint

COPY entrypoint /bin/entrypoint

CMD exec entrypoint
