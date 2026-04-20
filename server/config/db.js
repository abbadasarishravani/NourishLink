const mongoose = require('mongoose');
const dns = require('node:dns');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not set');
        }

        // If your network/DNS blocks SRV lookups (common on some Wi‑Fi/VPN/campus networks),
        // you can set DNS_SERVERS="8.8.8.8,1.1.1.1" in `.env` to force known resolvers.
        const dnsServersRaw = process.env.DNS_SERVERS;
        if (dnsServersRaw && uri.startsWith('mongodb+srv://')) {
            const servers = dnsServersRaw
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (servers.length) dns.setServers(servers);
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10_000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        const msg = error?.message || String(error);
        console.error(`MongoDB connection error: ${msg}`);
        if (typeof msg === 'string' && msg.includes('querySrv') && msg.includes('ECONNREFUSED')) {
            console.error(
                'Tip: Your DNS/network is refusing SRV queries for mongodb+srv. Try switching networks/VPN off, ' +
                    'or set DNS_SERVERS="8.8.8.8,1.1.1.1" in server/.env, or use the non-SRV "mongodb://" connection string from Atlas.'
            );
        }
        process.exit(1);
    }
};

module.exports = connectDB;
