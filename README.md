<p align="center">
  <img src=https://imgur.com/GSSjOR2.jpg>
</p>

<h1 align="center">Wayback Engine</h1>
<p align="center"><strong>Solana Wayback Machine Engine</strong></p>

<div align="center">
  
  <a href="https://opensource.org/licenses/Apache-2.0">![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)</a>  
  
</div>


wayback machine provides historical data about solana accounts. get the balances of all your accounts in a certain slot or blocktime.

Built on @solana ☀️

## Note
- **Wayback Engine is in active development, so all APIs are subject to change.**

## Installation 

```
npm i wayback-engine
```

## Usage
User Balance (Signature/Slot/Blocktime)
```
import { getBalanceAtSignature, ... } from 'wayback-engine'

const balance = await getBalanceAtSignature(connection, address, signature);
const balance = await getBalanceAtBlocktime(connection, address, 1644487905);
const balance = await getBalanceAtSlot(connection, address, 120188217);
```

Token Balance (Signature/Slot/Blocktime) and With/Without Token Metadata
```
// Token Balance with Signature
const balance = await getTokenBalanceAtSignature(connection, address, signature);

// Token Balance with Slot and Metadata
const balance = await getTokenBalanceAtSlotWithMetadata(connection, address, 92071481);
```

All Balances
```
const accountState = await getBalancesAtSignature(connection, address, signature);
```

## Features
|                         | Balance | Token Balance | All Balances | Data Account |
|-------------------------|:---------:|:---------------:|:--------------:|:--------------:|
| Signature               |    ✅    |       ✅       |       ✅      |       ❌      |
| Blocktime               |    ✅    |       ✅       |       ✅      |       ❌      |
| Slot                    |    ✅    |       ✅       |       ✅      |       ❌      |
| Signature with Metadata |         |       ✅       |       ✅      |              |
| Blocktime with Metadata |         |       ✅       |       ✅      |              |
| Slot with Metadata      |         |       ✅       |       ✅      |              |

## Todo
Get raw data at certain signature (Data account)
https://bpf.wtf/sol-state-history/

## License
Wayback Engine is licensed under Apache 2.0.

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in Wayback Engine by you, as defined in the Apache-2.0 license, shall be licensed as above, without any additional terms or conditions.

