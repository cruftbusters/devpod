docker run -it --rm \
  -p 8080:8080 \
  -v $(dirname $SSH_AUTH_SOCK):$(dirname $SSH_AUTH_SOCK) \
  -v $HOME/.gitconfig:/root/.gitconfig:ro \
  -e SSH_AUTH_SOCK=$SSH_AUTH_SOCK \
  devcontainer
