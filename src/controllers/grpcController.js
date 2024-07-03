const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { topup, deduct, getBalance } = require('../services/walletService');

const PROTO_PATH = './wallet.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const walletProto = grpc.loadPackageDefinition(packageDefinition).wallet;

function topupHandler(call, callback) {
    const { user_id, amount } = call.request;
    topup(user_id, amount)
        .then(result => {
            callback(null, { status: true, new_balance: result.newBalance, transaction_id: result.transactionId });
        })
        .catch(error => {
            callback({ code: grpc.status.INTERNAL, message: error.message });
        });
}

function deductHandler(call, callback) {
    const { user_id, amount } = call.request;
    deduct(user_id, amount)
        .then(result => {
            callback(null, { status: true, new_balance: result.newBalance, transaction_id: result.transactionId });
        })
        .catch(error => {
            callback({ code: grpc.status.INTERNAL, message: error.message });
        });
}

function getBalanceHandler(call, callback) {
    const { user_id } = call.request;
    getBalance(user_id)
        .then(result => {
            callback(null, { balance: result.balance });
        })
        .catch(error => {
            callback({ code: grpc.status.INTERNAL, message: error.message });
        });
}

function main() {
    const server = new grpc.Server();
    server.addService(walletProto.WalletService.service, { topup: topupHandler, deduct: deductHandler, getBalance: getBalanceHandler });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start();
    });
}

main();
