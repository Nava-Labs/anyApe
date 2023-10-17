import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { BuyButton } from "@/components/BuyButton";
import { Client, cacheExchange, fetchExchange } from "@urql/core";
import { getNftDetailsQuery } from "@/lib/gql/queries/nft";
import truncateEthAddress from "truncate-eth-address";

export const client = new Client({
  url: "https://api.thegraph.com/subgraphs/name/jonassunandar/any-ape-subgraph",
  exchanges: [cacheExchange, fetchExchange],
});

type Params = {
  params: {
    tokenId: string;
  };
};

export default async function NftDetails({ params }: Params) {
  const nftDetailsRes = await client
    .query(getNftDetailsQuery, {
      id: "0x0cfb5d82be2b949e8fa73a656df91821e2ad99fd-1",
    })
    .toPromise();
  if (!nftDetailsRes) throw new Error("Failed to fetch NFT details");

  console.log(nftDetailsRes.data);
  console.log(params.tokenId);

  // const response = await fetch(nftDetailsRes.data?.nft?.uri);
  // const data = await response.json();

  return (
    <div className="flex gap-x-8 h-full w-full">
      <div className="flex flex-col">
        <div className="w-full rounded-xl">
          <div className="flex h-full w-full items-center justify-center">
            {/* <img src={data.image} className="min-h-[600px]" /> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col py-5 w-full space-y-8">
        <div>
          <div className="text-2xl">
            {nftDetailsRes.data?.nft?.collectionName} #
            {params.tokenId.split("-")[1]}
          </div>
          <div>
            Owned by {truncateEthAddress(nftDetailsRes.data?.nft?.owner)}
          </div>
        </div>

        <div className="flex flex-col w-full border border-neutral-500 rounded-lg bg-neutral-900">
          <div className="flex items-center space-x-2 p-2 border-b-2">
            <TagIcon className="h-5" />
            <div className="text-xl">Price</div>
          </div>

          <div className="flex gap-x-2 justify-center items-center py-3">
            <img
              src="https://cryptologos.cc/logos/apecoin-ape-ape-logo.svg?v=026"
              className="h-8"
            />
            <span className="text-lg">{nftDetailsRes.data?.nft?.price}</span>
          </div>

          <div className="px-2 pb-3">
            <div className="flex items-center rounded-xl bg-blue-500 py-2">
              <BuyButton />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full border border-neutral-500 rounded-lg bg-neutral-900">
          <div>
            <div className="flex items-center space-x-2 p-2 border-b-2">
              <ArrowsUpDownIcon className="h-5" />
              <div className="text-xl">Activity</div>
            </div>
            <Table>
              <TableHeader className="border-b-neutral-500">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Event</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              {nftDetailsRes.data?.nft?.activity.map(
                (item: any, index: number) => (
                  <TableBody key={index}>
                    <TableCell>
                      {item.type === "Sale Cross Chain"
                        ? "Cross Chain Sale"
                        : "Native Sale"}
                    </TableCell>
                    <TableCell>{Number(item.price) / 1e18} APE</TableCell>
                    <TableCell>{truncateEthAddress(item.from)}</TableCell>
                    <TableCell>{truncateEthAddress(item.to)}</TableCell>
                    <TableCell>
                      {new Date(item.timestamp * 1000).toLocaleDateString()}
                    </TableCell>
                  </TableBody>
                )
              )}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
