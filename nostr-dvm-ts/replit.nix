{ pkgs }: {
    deps = [
        pkgs.imagemagick6_light
        pkgs.import type { NostrEvent } from '@nostr-dev-kit/ndk';
        pkgs.import NDK from '@nostr-dev-kit/ndk';
        pkgs.import { nip19 } from 'nostr-tools';
        pkgs.import { useState, useEffect } from 'react';
        pkgs.yarn
        pkgs.esbuild
        pkgs.nodejs-16_x

        pkgs.nodePackages.typescript
        pkgs.nodePackages.typescript-language-server
    ];
}