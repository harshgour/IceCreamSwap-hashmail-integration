import { useEffect, useState } from 'react'
import uniqBy from 'lodash/uniqBy'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { ethers } from 'ethers'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { isAddress } from 'utils'
import { fetchCollections, fetchNftsFromCollections } from './reducer'
import { State } from '../types'
import { UserNftsState, AskOrder, Transaction, TokenIdWithCollectionAddress, TokenMarketData, NftToken } from './types'
import { getNftsFromDifferentCollectionsApi } from './helpers'

export const useFetchCollections = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCollections())
    dispatch(fetchNftsFromCollections(pancakeBunniesAddress))
  }, [dispatch])
}

export const useGetCollections = () => {
  return useSelector((state: State) => state.nftMarket.data.collections)
}

export const useGetCollection = (collectionAddress: string) => {
  const collections = useGetCollections()
  return collections[collectionAddress]
}

export const useNftsFromCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = isAddress(collectionAddress) || ''
  const nfts = useSelector((state: State) => state.nftMarket.data.nfts[checksummedCollectionAddress])
  return nfts
}

export const useGetAllBunniesByBunnyId = (bunnyId: string) => {
  const nfts = useSelector((state: State) => state.nftMarket.data.nfts[pancakeBunniesAddress])
  return nfts ? nfts.filter((nft) => nft.attributes[0].value === bunnyId && nft.marketData.isTradable) : []
}

export const useGetNFTInitializationState = () => {
  return useSelector((state: State) => state.nftMarket.initializationState)
}

export const useUserNfts = (): UserNftsState => {
  return useSelector((state: State) => state.nftMarket.data.user)
}

export const useUserActivity = (): (Transaction | AskOrder)[] => {
  const userNftState = useUserNfts()
  const {
    activity: { askOrderHistory, buyTradeHistory, sellTradeHistory },
  } = userNftState

  const allActivity = [...askOrderHistory, ...buyTradeHistory, ...sellTradeHistory]
  if (allActivity.length > 0) {
    const sortedByMostRecent = allActivity.sort((activityItem1, activityItem2) => {
      const timestamp1 = ethers.BigNumber.from(activityItem1.timestamp)
      const timestamp2 = ethers.BigNumber.from(activityItem2.timestamp)
      return timestamp2.sub(timestamp1).toNumber()
    })
    // TODO: This return is an array of different types (AskOrders & Transactions)
    // Once the UI requirements are clearer - there could be data transformation of these to return data of one type
    return sortedByMostRecent
  }
  return []
}

/**
 * Fetch metadata for a given array of Nft subgraph responses
 * @param sgNfts NftTokenSg[]
 * @returns NFT[]
 */
export const useGetNftMetadata = (sgNfts: TokenMarketData[], account?: string) => {
  const [nftMetadata, setNftMetadata] = useState<NftToken[]>([])

  useEffect(() => {
    const fetchMetadata = async () => {
      const nftTokenIds = uniqBy(
        sgNfts.map((nft): TokenIdWithCollectionAddress => {
          return { tokenId: nft.tokenId, collectionAddress: nft.collection.id }
        }),
        'tokenId',
      )

      const nfts = await getNftsFromDifferentCollectionsApi(nftTokenIds)
      setNftMetadata(nfts)
    }

    if (sgNfts.length > 0) {
      fetchMetadata()
    }
  }, [sgNfts])

  useEffect(() => {
    // Clear metadata on account change
    setNftMetadata([])
  }, [account])

  return nftMetadata
}