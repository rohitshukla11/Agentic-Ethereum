// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useAccount, useConnect, useDisconnect } from 'wagmi';
// import { useOnchainKit } from '@coinbase/onchainkit';

// const DummyComponent: React.FC = () => {
//   const { address, isConnected } = useAccount();
//   const { connect, connectors } = useConnect();
//   const { disconnect } = useDisconnect();
//   const onchainKit = useOnchainKit(); // Get OnchainKit instance

//   const [onchainIdentity, setOnchainIdentity] = useState<string | null>(null);

//   useEffect(() => {
//     console.log('OnchainKit instance:', onchainKit);

//     // if (isConnected && onchainKit) {
//     //   (async () => {
//     //     try {
//     //       const identity = await onchainKit.getIdentity(address!);
//     //       console.log('Onchain Identity:', identity);
//     //       setOnchainIdentity(JSON.stringify(identity, null, 2));
//     //     } catch (error) {
//     //       console.error('Error fetching Onchain Identity:', error);
//     //     }
//     //   })();
//     // }
//   }, [isConnected, onchainKit, address]);

//   return (
//     <div>
//       <h1>Dummy Component</h1>
//       <p>Testing Wallet Connection</p>
//       {isConnected ? (
//         <div>
//           <p>Connected Wallet Address: {address}</p>
//           <button onClick={() => disconnect()}>Disconnect Wallet</button>
//           {onchainIdentity && (
//             <pre>
//               <strong>Onchain Identity:</strong> <br />
//               {onchainIdentity}
//             </pre>
//           )}
//         </div>
//       ) : (
//         <div>
//           <p>No wallet connected.</p>
//           {connectors.map((connector) => (
//             <button
//               key={connector.uid}
//               onClick={() => connect({ connector })}
//               style={{ marginRight: '8px' }}
//             >
//               Connect {connector.name}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DummyComponent;

import Chat from "../app/components/chat"

export default function Home() {
  return (
    <main className="flex h-screen bg-background">
      <Chat />
    </main>
  )
}

