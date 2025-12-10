FROM python:3.12-alpine
LABEL authors="HangoverHGV"
LABEL maintainer="HangoverHGV"
LABEL description="Backend for Vadini Website"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime dependencies for WeasyPrint
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    musl-dev \
    bash \
    curl \
    ca-certificates \
    cairo-dev \
    pango-dev \
    gdk-pixbuf-dev \
    freetype-dev \
    fontconfig \
    ttf-dejavu \
    libffi-dev \
    glib-dev \
    gobject-introspection \
    && rm -rf /var/cache/apk/*

# Copy and install Python dependencies
COPY ./requirements.txt /tmp/requirements.txt
COPY ./ /app
RUN pip install --upgrade pip
RUN pip install -r /tmp/requirements.txt

# Optional: remove build dependencies if desired
RUN apk del build-base \
    && rm -rf /tmp

# Create app user and folders
RUN adduser --disabled-password --no-create-home appuser \
    && mkdir -p /vol/web/media /vol/web/static \
    && chown -R appuser:appuser /vol \
    && chmod -R 755 /vol/web \
    && chown -R appuser:appuser /app

USER appuser