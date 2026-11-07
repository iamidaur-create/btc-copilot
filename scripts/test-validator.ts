import { validateBitcoinAddress } from '../lib/bitcoin/validate-address.ts';

const testCases = [
  {
    name: 'Satoshi Genesis Address (Legacy P2PKH)',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    expectedValid: true,
    expectedType: 'legacy',
  },
  {
    name: 'Bitfinex Cold Wallet (P2SH)',
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    expectedValid: true,
    expectedType: 'p2sh',
  },
  {
    name: 'Native SegWit (Bech32 P2WPKH)',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    expectedValid: true,
    expectedType: 'segwit',
  },
  {
    name: 'Taproot Address (Bech32m P2TR)',
    address: 'bc1p5d7rjq7g6rdk2yhzks9s2uma66dn3x5aftyxhe54jjtrejwt8hsseqgkgr',
    expectedValid: true,
    expectedType: 'taproot',
  },
  {
    name: 'Invalid - contains forbidden Base58 zero',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Div00',
    expectedValid: false,
  },
  {
    name: 'Invalid - too short',
    address: '1Bitcoin',
    expectedValid: false,
  },
  {
    name: 'Invalid - empty string',
    address: '   ',
    expectedValid: false,
  },
];

console.log('--- Testing Bitcoin Address Validator ---');
let allPassed = true;

for (const tc of testCases) {
  const res = validateBitcoinAddress(tc.address);
  const pass = res.isValid === tc.expectedValid && 
    (!tc.expectedType || res.type === tc.expectedType);

  if (pass) {
    console.log(`✅ PASS: ${tc.name} -> isValid=${res.isValid}, type=${res.type}`);
  } else {
    console.error(`❌ FAIL: ${tc.name}`);
    console.error(`   Expected valid=${tc.expectedValid}, type=${tc.expectedType}`);
    console.error(`   Received valid=${res.isValid}, type=${res.type}, error=${res.error}`);
    allPassed = false;
  }
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('🎉 All validator tests passed successfully!');
}
