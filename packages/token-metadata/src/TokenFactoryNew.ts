import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  TokenType,
  TokenSource,
  TokenMetaNew,
  IbcTokenMetaNew,
} from './types'
type TokenMeta = TokenMetaNew | IbcTokenMetaNew

export class TokenFactoryNew {
  public registry: TokenMeta[]

  constructor(registry: TokenMeta[]) {
    this.registry = registry
  }

  toToken(denom: string): Token | undefined {
    if (denom === INJ_DENOM) {
      return this.getMetaBySymbol(INJ_DENOM)
    }

    return this.getMetaBySymbol(denom) || this.getMetaByDenomOrAddress(denom)
  }

  getMetaBySymbol(
    symbol: string,
    { source, type }: { source?: TokenSource; type?: TokenType } = {},
  ): TokenMeta | undefined {
    return this.registry.find((tokenMeta) => {
      const isType = !type || tokenMeta.tokenType === type
      const isSource = !source || tokenMeta.source === source
      const isSymbol = tokenMeta.symbol.toLowerCase() === symbol.toLowerCase()

      return isSymbol && isSource && isType
    })
  }

  getMetaByDenomOrAddress(value: string): TokenMeta | undefined {
    const formattedValue = value.toLowerCase()

    return this.registry.find((tokenMeta) => {
      if (!tokenMeta.denom) {
        return false
      }

      const formattedDenom = tokenMeta.denom?.toLowerCase()

      return (
        formattedDenom === formattedValue ||
        formattedDenom.endsWith(formattedValue) ||
        formattedDenom.includes(`/${formattedDenom}/`)
      )
    })
  }
}
