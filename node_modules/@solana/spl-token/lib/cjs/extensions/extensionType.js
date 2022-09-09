"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountLenForMint = exports.getExtensionTypes = exports.getExtensionData = exports.getAccountLen = exports.getMintLen = exports.getAccountTypeOfMintType = exports.getTypeLen = exports.LENGTH_SIZE = exports.TYPE_SIZE = exports.ExtensionType = void 0;
const account_js_1 = require("../state/account.js");
const mint_js_1 = require("../state/mint.js");
const multisig_js_1 = require("../state/multisig.js");
const accountType_js_1 = require("./accountType.js");
const index_js_1 = require("./defaultAccountState/index.js");
const immutableOwner_js_1 = require("./immutableOwner.js");
const state_js_1 = require("./interestBearingMint/state.js");
const index_js_2 = require("./memoTransfer/index.js");
const mintCloseAuthority_js_1 = require("./mintCloseAuthority.js");
const nonTransferable_js_1 = require("./nonTransferable.js");
const index_js_3 = require("./transferFee/index.js");
var ExtensionType;
(function (ExtensionType) {
    ExtensionType[ExtensionType["Uninitialized"] = 0] = "Uninitialized";
    ExtensionType[ExtensionType["TransferFeeConfig"] = 1] = "TransferFeeConfig";
    ExtensionType[ExtensionType["TransferFeeAmount"] = 2] = "TransferFeeAmount";
    ExtensionType[ExtensionType["MintCloseAuthority"] = 3] = "MintCloseAuthority";
    ExtensionType[ExtensionType["ConfidentialTransferMint"] = 4] = "ConfidentialTransferMint";
    ExtensionType[ExtensionType["ConfidentialTransferAccount"] = 5] = "ConfidentialTransferAccount";
    ExtensionType[ExtensionType["DefaultAccountState"] = 6] = "DefaultAccountState";
    ExtensionType[ExtensionType["ImmutableOwner"] = 7] = "ImmutableOwner";
    ExtensionType[ExtensionType["MemoTransfer"] = 8] = "MemoTransfer";
    ExtensionType[ExtensionType["NonTransferable"] = 9] = "NonTransferable";
    ExtensionType[ExtensionType["InterestBearingMint"] = 10] = "InterestBearingMint";
})(ExtensionType = exports.ExtensionType || (exports.ExtensionType = {}));
exports.TYPE_SIZE = 2;
exports.LENGTH_SIZE = 2;
// NOTE: All of these should eventually use their type's Span instead of these
// constants.  This is provided for at least creation to work.
function getTypeLen(e) {
    switch (e) {
        case ExtensionType.Uninitialized:
            return 0;
        case ExtensionType.TransferFeeConfig:
            return index_js_3.TRANSFER_FEE_CONFIG_SIZE;
        case ExtensionType.TransferFeeAmount:
            return index_js_3.TRANSFER_FEE_AMOUNT_SIZE;
        case ExtensionType.MintCloseAuthority:
            return mintCloseAuthority_js_1.MINT_CLOSE_AUTHORITY_SIZE;
        case ExtensionType.ConfidentialTransferMint:
            return 97;
        case ExtensionType.ConfidentialTransferAccount:
            return 286;
        case ExtensionType.DefaultAccountState:
            return index_js_1.DEFAULT_ACCOUNT_STATE_SIZE;
        case ExtensionType.ImmutableOwner:
            return immutableOwner_js_1.IMMUTABLE_OWNER_SIZE;
        case ExtensionType.MemoTransfer:
            return index_js_2.MEMO_TRANSFER_SIZE;
        case ExtensionType.NonTransferable:
            return nonTransferable_js_1.NON_TRANSFERABLE_SIZE;
        case ExtensionType.InterestBearingMint:
            return state_js_1.INTEREST_BEARING_MINT_CONFIG_STATE_SIZE;
        default:
            throw Error(`Unknown extension type: ${e}`);
    }
}
exports.getTypeLen = getTypeLen;
function getAccountTypeOfMintType(e) {
    switch (e) {
        case ExtensionType.TransferFeeConfig:
            return ExtensionType.TransferFeeAmount;
        case ExtensionType.ConfidentialTransferMint:
            return ExtensionType.ConfidentialTransferAccount;
        case ExtensionType.TransferFeeAmount:
        case ExtensionType.ConfidentialTransferAccount:
        case ExtensionType.DefaultAccountState:
        case ExtensionType.ImmutableOwner:
        case ExtensionType.MemoTransfer:
        case ExtensionType.MintCloseAuthority:
        case ExtensionType.NonTransferable:
        case ExtensionType.Uninitialized:
        case ExtensionType.InterestBearingMint:
            return ExtensionType.Uninitialized;
    }
}
exports.getAccountTypeOfMintType = getAccountTypeOfMintType;
function getLen(extensionTypes, baseSize) {
    if (extensionTypes.length === 0) {
        return baseSize;
    }
    else {
        const accountLength = account_js_1.ACCOUNT_SIZE +
            accountType_js_1.ACCOUNT_TYPE_SIZE +
            extensionTypes
                .filter((element, i) => i === extensionTypes.indexOf(element))
                .map((element) => getTypeLen(element) + exports.TYPE_SIZE + exports.LENGTH_SIZE)
                .reduce((a, b) => a + b);
        if (accountLength === multisig_js_1.MULTISIG_SIZE) {
            return accountLength + exports.TYPE_SIZE;
        }
        else {
            return accountLength;
        }
    }
}
function getMintLen(extensionTypes) {
    return getLen(extensionTypes, mint_js_1.MINT_SIZE);
}
exports.getMintLen = getMintLen;
function getAccountLen(extensionTypes) {
    return getLen(extensionTypes, account_js_1.ACCOUNT_SIZE);
}
exports.getAccountLen = getAccountLen;
function getExtensionData(extension, tlvData) {
    let extensionTypeIndex = 0;
    while (extensionTypeIndex < tlvData.length) {
        const entryType = tlvData.readUInt16LE(extensionTypeIndex);
        const entryLength = tlvData.readUInt16LE(extensionTypeIndex + exports.TYPE_SIZE);
        const typeIndex = extensionTypeIndex + exports.TYPE_SIZE + exports.LENGTH_SIZE;
        if (entryType == extension) {
            return tlvData.slice(typeIndex, typeIndex + entryLength);
        }
        extensionTypeIndex = typeIndex + entryLength;
    }
    return null;
}
exports.getExtensionData = getExtensionData;
function getExtensionTypes(tlvData) {
    const extensionTypes = [];
    let extensionTypeIndex = 0;
    while (extensionTypeIndex < tlvData.length) {
        const entryType = tlvData.readUInt16LE(extensionTypeIndex);
        extensionTypes.push(entryType);
        const entryLength = tlvData.readUInt16LE(extensionTypeIndex + exports.TYPE_SIZE);
        extensionTypeIndex += exports.TYPE_SIZE + exports.LENGTH_SIZE + entryLength;
    }
    return extensionTypes;
}
exports.getExtensionTypes = getExtensionTypes;
function getAccountLenForMint(mint) {
    const extensionTypes = getExtensionTypes(mint.tlvData);
    const accountExtensions = extensionTypes.map(getAccountTypeOfMintType);
    return getAccountLen(accountExtensions);
}
exports.getAccountLenForMint = getAccountLenForMint;
//# sourceMappingURL=extensionType.js.map