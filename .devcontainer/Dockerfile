# Use an official Node runtime as a parent image
FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

RUN apt-get update && apt-get install -y \
    awscli \
    && rm -rf /var/lib/apt/lists/*