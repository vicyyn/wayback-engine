"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDisableRequiredMemoTransfersInstruction = exports.createEnableRequiredMemoTransfersInstruction = exports.memoTransferInstructionData = exports.MemoTransferInstruction = void 0;
const buffer_layout_1 = require("@solana/buffer-layout");
const web3_js_1 = require("@solana/web3.js");
const constants_js_1 = require("../../constants.js");
const errors_js_1 = require("../../errors.js");
const types_js_1 = require("../../instructions/types.js");
var MemoTransferInstruction;
(function (MemoTransferInstruction) {
    MemoTransferInstruction[MemoTransferInstruction["Enable"] = 0] = "Enable";
    MemoTransferInstruction[MemoTransferInstruction["Disable"] = 1] = "Disable";
})(MemoTransferInstruction = exports.MemoTransferInstruction || (exports.MemoTransferInstruction = {}));
/** TODO: docs */
exports.memoTransferInstructionData = (0, buffer_layout_1.struct)([
    (0, buffer_layout_1.u8)('instruction'),
    (0, buffer_layout_1.u8)('memoTransferInstruction'),
]);
/**
 * Construct an EnableRequiredMemoTransfers instruction
 *
 * @param account         Token account to update
 * @param authority       The account's owner/delegate
 * @param signers         The signer account(s)
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createEnableRequiredMemoTransfersInstruction(account, authority, multiSigners = [], programId = constants_js_1.TOKEN_2022_PROGRAM_ID) {
    return createMemoTransferInstruction(/* enable */ true, account, authority, multiSigners, programId);
}
exports.createEnableRequiredMemoTransfersInstruction = createEnableRequiredMemoTransfersInstruction;
/**
 * Construct a DisableMemoTransfer instruction
 *
 * @param account         Token account to update
 * @param authority       The account's owner/delegate
 * @param signers         The signer account(s)
 * @param programId       SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createDisableRequiredMemoTransfersInstruction(account, authority, multiSigners = [], programId = constants_js_1.TOKEN_2022_PROGRAM_ID) {
    return createMemoTransferInstruction(/* enable */ false, account, authority, multiSigners, programId);
}
exports.createDisableRequiredMemoTransfersInstruction = createDisableRequiredMemoTransfersInstruction;
function createMemoTransferInstruction(enable, account, authority, multiSigners, programId) {
    if (!(0, constants_js_1.programSupportsExtensions)(programId)) {
        throw new errors_js_1.TokenUnsupportedInstructionError();
    }
    const keys = [{ pubkey: account, isSigner: false, isWritable: true }];
    keys.push({ pubkey: authority, isSigner: !multiSigners.length, isWritable: false });
    for (const signer of multiSigners) {
        keys.push({ pubkey: signer.publicKey, isSigner: true, isWritable: false });
    }
    const data = Buffer.alloc(exports.memoTransferInstructionData.span);
    exports.memoTransferInstructionData.encode({
        instruction: types_js_1.TokenInstruction.MemoTransferExtension,
        memoTransferInstruction: enable ? MemoTransferInstruction.Enable : MemoTransferInstruction.Disable,
    }, data);
    return new web3_js_1.TransactionInstruction({ keys, programId, data });
}
//# sourceMappingURL=instructions.js.map