docker run -it --rm \
  -p 5173:5173 \
  -p 5174:5174 \
  -p 5175:5175 \
  -v $(dirname $SSH_AUTH_SOCK):$(dirname $SSH_AUTH_SOCK) \
  -v $HOME/.gitconfig:/root/.gitconfig:ro \
  -e SSH_AUTH_SOCK=$SSH_AUTH_SOCK \
  devcontainer
