import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { Heart, ExternalLink, Copy, Check } from "lucide-react-native";
import { useState, useCallback } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

import { Text } from "@/components/ui/text";
import { useColors } from "@/hooks/use-colors";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const QUICK_DONATE = [
  { label: "PayPal", url: "https://paypal.me/jaycho1214" },
  { label: "Buy Me a Coffee", url: "https://buymeacoffee.com/jaycho1214" },
];

const CRYPTO = [
  {
    symbol: "BTC",
    network: "Bitcoin",
    address: "bc1q9zwl2hpz8w2lencs0s9h7hqnnlc2lc2e608dr5",
  },
  {
    symbol: "ETH",
    network: "Ethereum",
    address: "0x298faB96217675ab5D0a0e6Cbab81506741bc4B3",
  },
  {
    symbol: "XRP",
    network: "Ripple",
    note: "Tag: Empty or 0",
    address: "rMQ1Sh6gFYP5N6wG1h8WG7PojZEMPux6Cf",
  },
  {
    symbol: "XLM",
    network: "Stellar",
    note: "Tag: Empty or 0",
    address: "GBOCGEVEVOZH33IDFGUC2FWJY4GVBMNCHM2QQOHPOWRAEESVFNFWDGTN",
  },
  {
    symbol: "SOL",
    network: "Solana",
    address: "kR7rNU34Htmn87BkYRgvvQxdFprpQUAfQ2wcyspKwwg",
  },
  {
    symbol: "DOGE",
    network: "Dogecoin",
    address: "DQf8njepghCNiAQ1ytoku2v4f1wSXDTiXo",
  },
];

// ---------------------------------------------------------------------------
// Crypto address row
// ---------------------------------------------------------------------------

function CryptoRow({
  symbol,
  network,
  note,
  address,
}: {
  symbol: string;
  network: string;
  note?: string;
  address: string;
}) {
  const colors = useColors();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [address]);

  return (
    <Pressable
      onPress={handleCopy}
      style={[
        styles.cryptoCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.cryptoHeader}>
        <Text style={[styles.cryptoSymbol, { color: colors.text }]}>
          {symbol}
        </Text>
        <Text style={[styles.cryptoNetwork, { color: colors.textMuted }]}>
          {network}
          {note ? ` \u00B7 ${note}` : ""}
        </Text>
        {copied ? (
          <Check size={16} color={colors.accent} strokeWidth={2} />
        ) : (
          <Copy size={16} color={colors.textMuted} strokeWidth={1.5} />
        )}
      </View>
      <Text
        style={[styles.cryptoAddress, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {address}
      </Text>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function DonateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen
        options={{
          title: "Donate",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerStyle: { backgroundColor: "transparent" },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: colors.text,
            fontSize: 17,
            fontWeight: "600",
          },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 52,
          paddingBottom: insets.bottom + 40,
        }}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
          />
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            <Text style={[styles.introBold, { color: colors.text }]}>
              Selah
            </Text>
            {
              " is a place where faith shines, hearts connect, and our walk with God is strengthened together. As a community-driven platform, we rely solely on the generous support of people like you to continue growing this mission."
            }
          </Text>

          <View style={[styles.scripture, { borderLeftColor: colors.border }]}>
            <Text style={[styles.scriptureText, { color: colors.textMuted }]}>
              {
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
              }
            </Text>
            <Text style={[styles.scriptureRef, { color: colors.textMuted }]}>
              2 Corinthians 9:7
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Quick donate */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support Selah
          </Text>
          <View style={styles.quickDonateRow}>
            {QUICK_DONATE.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Linking.openURL(item.url);
                }}
                style={[
                  styles.quickDonateBtn,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ExternalLink
                  size={18}
                  color={colors.accent}
                  strokeWidth={1.5}
                />
                <Text style={[styles.quickDonateLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={[styles.fundsNote, { color: colors.textMuted }]}>
            Your support goes toward server hosting, platform development,
            community growth, and expanding Bible content.
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Crypto */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Cryptocurrency
          </Text>
          <View style={styles.cryptoList}>
            {CRYPTO.map((c) => (
              <CryptoRow key={c.symbol} {...c} />
            ))}
          </View>
        </View>

        {/* Sign-off */}
        <View style={styles.signoff}>
          <Heart size={16} color={colors.textMuted} strokeWidth={1.5} />
          <Text style={[styles.signoffText, { color: colors.textMuted }]}>
            {'"Let your light shine before others..." \u2013 Matthew 5:16'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  intro: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 26,
  },
  introBold: {
    fontWeight: "700",
  },
  scripture: {
    marginTop: 20,
    borderLeftWidth: 2,
    paddingLeft: 16,
    paddingVertical: 4,
  },
  scriptureText: {
    fontSize: 14,
    lineHeight: 24,
    fontStyle: "italic",
  },
  scriptureRef: {
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  quickDonateRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  quickDonateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickDonateLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  fundsNote: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 20,
  },
  cryptoList: {
    marginTop: 16,
    gap: 10,
  },
  cryptoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cryptoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-start",
  },
  cryptoSymbol: {
    fontSize: 15,
    fontWeight: "600",
  },
  cryptoNetwork: {
    fontSize: 13,
  },
  cryptoAddress: {
    fontSize: 13,
  },
  signoff: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  signoffText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
