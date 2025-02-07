'use client';

import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { coinbaseWallet } from '@wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

const config = createConfig({
    chains: [base],
    connectors: [
        coinbaseWallet({
            appName: 'onchain-commerce-template',
        }),
    ],
    ssr: true,
    transports: {
        [base.id]: http(),
    },
});

export function Providers(props: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <RainbowKitProvider>
                    <OnchainKitProvider
                        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                        chain={base} // Use base or baseSepolia
                    >
                        {props.children}
                    </OnchainKitProvider>
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}
