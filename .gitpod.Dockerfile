FROM gitpod/workspace-node
RUN sudo apt update
RUN yes | sudo apt upgrade
RUN yes | sudo apt install openjdk-8-jdk