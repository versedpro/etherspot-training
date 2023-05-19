import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, injectedWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { polygonMumbai, optimismGoerli, goerli, gnosisChiado } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { BananaWallet } from "@rize-labs/banana-rainbowkit-plugin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CssBaseline } from "@mui/material";
import Layout from "./components/Layout";
import NoMatch from "./pages/NoMatch";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "mint",
        async lazy() {
          let Mint = await import("./pages/Mint");
          return { Component: Mint.default };
        },
      },
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  },
]);

function App() {
  const { chains, provider } = configureChains(
    // currently on these three chains are supported by BananaWallet
    [polygonMumbai, optimismGoerli, goerli, gnosisChiado],
    [publicProvider()]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        BananaWallet({ chains, connect: { networkId: 80001 } }),
        metaMaskWallet({ chains, shimDisconnect: true }),
        rainbowWallet({ chains }),
        walletConnectWallet({ chains }),
        injectedWallet({ chains, shimDisconnect: true }),
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <div className="App">
      <CssBaseline />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <RouterProvider router={router} fallbackElement={<p>Loading...</p>}></RouterProvider>
        </RainbowKitProvider>
      </WagmiConfig>
      <ToastContainer />
    </div>
  );
}

export default App;
