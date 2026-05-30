import { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

const NAV_LINKS = [
  { label: 'Pagrindinis', href: '/' },
  { label: 'Receptai', href: '/recipes' },
  { label: 'Blogas', href: '/blog' },
  { label: 'Kontaktai', href: '/contact' },
];

const INGREDIENT_ROWS = [
  { name: 'Bulvės', amount: '2 vnt.', icon: '🥔' },
  { name: 'Kiaušiniai', amount: '4 vnt.', icon: '🥚' },
  { name: 'Sūris', amount: '120 g', icon: '🧀' },
];

const MEAL_TYPES = [
  { label: 'Pusryčiai', emoji: '🍳' },
  { label: 'Pietūs', emoji: '🥗' },
  { label: 'Vakarienė', emoji: '🍝' },
  { label: 'Užkandis', emoji: '🍪' },
];

const FOOTER_TEXT = {
  recipesTitle: 'Jau suvalgėm!',
  recipesDescription: 'Rask idėjų iš to, ką jau turi namuose.',
  articlesTitle: 'Straipsniai',
  articlesDescription: 'Naudingi patarimai apie maistą ir virtuvę.',
  contactTitle: 'Kontaktai',
  contactDescription: 'Parašyk mums, jei turi idėjų ar klausimų.',
  copyright: 'Visos teisės saugomos.',
  privacy: 'Privatumo politika',
  email: 'hello@suvalgyk.lt',
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'image' | 'text'>('text');
  const width = Dimensions.get('window').width;
  const isWide = useMemo(() => width >= 900, [width]);

  const showStaticNotice = () => {
    Alert.alert('Sveiki', 'Šiame ekrane rodoma statinė pradinio puslapio versija.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ExpoStatusBar style="dark" />

      {sidebarOpen ? <Pressable style={styles.overlay} onPress={() => setSidebarOpen(false)} /> : null}

      <View style={[styles.sidebar, sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed]}>
        <View style={styles.sidebarHeader}>
          <View>
            <Text style={styles.sidebarBrand}>SUVALGYK</Text>
            <Text style={styles.sidebarTag}>Tavo virtuvės padėjėjas</Text>
          </View>
          <Pressable onPress={() => setSidebarOpen(false)} style={styles.iconButton}>
            <Text style={styles.iconButtonText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.sidebarLinks}>
          {NAV_LINKS.map((link) => (
            <Pressable key={link.href} style={styles.sidebarLink} onPress={() => setSidebarOpen(false)}>
              <Text style={styles.sidebarLinkText}>{link.label}</Text>
              <Text style={styles.sidebarLinkChevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sidebarFooter}>
          <Text style={styles.sidebarFooterTitle}>Sukurk receptą iš to, ką jau turi.</Text>
          <Text style={styles.sidebarFooterText}>
            Greitai, pigiai ir be švaistymo. Pirmas žingsnis prasideda nuo ingredientų arba nuotraukos.
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageFrame}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>S</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>Suvalgyk</Text>
                <Text style={styles.brandSubtitle}>neišmesk!</Text>
              </View>
            </View>

            <Pressable style={styles.menuButton} onPress={() => setSidebarOpen((value) => !value)}>
              <Text style={styles.menuButtonIcon}>{sidebarOpen ? '✕' : '☰'}</Text>
              <Text style={styles.menuButtonLabel}>Meniu</Text>
            </Pressable>
          </View>

          <View style={[styles.heroCard, isWide ? styles.heroWide : null]}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagDot}>•</Text>
              <Text style={styles.heroTagText}>Tavo virtuvės padėjėjas</Text>
            </View>
            <Text style={styles.heroTitle}>
              Suvalgyk <Text style={styles.heroAccent}>–</Text>
              {'\n'}neišmesk!
            </Text>
            <Text style={styles.heroSubtitle}>
              Sugalvok, ką pagaminti iš to, ką jau turi namuose. Greitai, pigiai ir be švaistymo.
            </Text>

            <View style={styles.heroChips}>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipEmoji}>🍳</Text>
                <Text style={styles.heroChipText}>Iš tavo produktų</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipEmoji}>💸</Text>
                <Text style={styles.heroChipText}>Pigu ir skanu</Text>
              </View>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipEmoji}>♻️</Text>
                <Text style={styles.heroChipText}>Mažiau švaistymo</Text>
              </View>
            </View>

            <View style={styles.heroIllustration}>
              <Text style={styles.floatingEmoji1}>🥦</Text>
              <Text style={styles.floatingEmoji2}>🧀</Text>
              <Text style={styles.floatingEmoji3}>🍅</Text>
              <Text style={styles.floatingEmoji4}>🥕</Text>
              <Text style={styles.floatingEmoji5}>🌶️</Text>
              <Text style={styles.floatingEmoji6}>🥚</Text>
              <View style={styles.cookCircle}>
                <Text style={styles.cookEmoji}>👨‍🍳</Text>
              </View>
            </View>

            <Text style={styles.heroProof}>
              🥗 Jau sugeneruota <Text style={styles.heroProofStrong}>tūkstančiai</Text> receptų iš likučių
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formTabs}>
              <Pressable
                style={[styles.tabButton, activeMode === 'image' ? styles.tabButtonActive : null]}
                onPress={() => setActiveMode('image')}
              >
                <Text style={[styles.tabButtonText, activeMode === 'image' ? styles.tabButtonTextActive : null]}>
                  📷 Įkelti nuotrauką
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tabButton, activeMode === 'text' ? styles.tabButtonActive : null]}
                onPress={() => setActiveMode('text')}
              >
                <Text style={[styles.tabButtonText, activeMode === 'text' ? styles.tabButtonTextActive : null]}>
                  ✏️ Įvesti ranka
                </Text>
              </Pressable>
            </View>

            {activeMode === 'text' ? (
              <View style={styles.sectionGroup}>
                <View style={styles.sectionLabelRow}>
                  <Text style={styles.sectionLabel}>Ingredientų lentelė</Text>
                  <Text style={styles.sectionLabelMuted}>Įrašyk pavadinimą arba kiekį</Text>
                </View>

                <View style={styles.ingredientTable}>
                  <View style={styles.ingredientTableHeader}>
                    <Text style={[styles.ingredientTableHeadCell, styles.cellIcon]}>#</Text>
                    <Text style={[styles.ingredientTableHeadCell, styles.cellName]}>Ingredientas</Text>
                    <Text style={[styles.ingredientTableHeadCell, styles.cellAmount]}>Kiekis</Text>
                  </View>
                  {INGREDIENT_ROWS.map((row) => (
                    <View key={row.name} style={styles.ingredientRow}>
                      <View style={[styles.ingredientCell, styles.cellIcon]}>
                        <Text style={styles.ingredientIcon}>{row.icon}</Text>
                      </View>
                      <View style={[styles.ingredientCell, styles.cellName]}>
                        <TextInput
                          defaultValue={row.name}
                          placeholder="Ingrediento pavadinimas"
                          placeholderTextColor="#8a8f87"
                          style={styles.ingredientInput}
                        />
                      </View>
                      <View style={[styles.ingredientCell, styles.cellAmount]}>
                        <TextInput
                          defaultValue={row.amount}
                          placeholder="Pvz. 2 vnt."
                          placeholderTextColor="#8a8f87"
                          style={styles.ingredientInput}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <Pressable style={styles.secondaryButton} onPress={showStaticNotice}>
                  <Text style={styles.secondaryButtonText}>+ Pridėti dar vieną eilutę</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Įkelk ingredientų nuotrauką</Text>
                <View style={styles.uploadBox}>
                  <Text style={styles.uploadIcon}>🖼️</Text>
                  <Text style={styles.uploadTitle}>Nufotografuok arba įkelk iš galerijos</Text>
                  <Text style={styles.uploadText}>
                    Šis ekranas šiuo metu yra statinis, bet rodo tą pačią įkėlimo struktūrą kaip ir web versija.
                  </Text>

                  <View style={styles.uploadActions}>
                    <Pressable style={styles.primaryButton} onPress={showStaticNotice}>
                      <Text style={styles.primaryButtonText}>📷 Kamera</Text>
                    </Pressable>
                    <Pressable style={styles.secondaryButton} onPress={showStaticNotice}>
                      <Text style={styles.secondaryButtonText}>🖼️ Galerija</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.sectionGroup}>
              <Text style={styles.sectionLabel}>Papildomi pageidavimai</Text>
              <TextInput
                defaultValue="Be glitimo, jei įmanoma"
                placeholder="Papildomi pageidavimai"
                placeholderTextColor="#8a8f87"
                style={[styles.textArea, styles.multiLineInput]}
                multiline
              />
            </View>

            <View style={styles.sectionGroup}>
              <Text style={styles.sectionLabel}>Valgio tipas</Text>
              <View style={styles.mealTypeRow}>
                {MEAL_TYPES.map((mealType, index) => (
                  <Pressable
                    key={mealType.label}
                    style={[styles.mealChip, index === 1 ? styles.mealChipActive : null]}
                    onPress={showStaticNotice}
                  >
                    <Text style={styles.mealChipText}>
                      {mealType.emoji} {mealType.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable style={styles.submitButton} onPress={showStaticNotice}>
              <Text style={styles.submitButtonText}>Sukurti receptą</Text>
            </Pressable>
          </View>

          <View style={styles.footerCard}>
            <View style={styles.footerTopGrid}>
              <View style={styles.footerBrandBlock}>
                <View style={styles.footerBrandRow}>
                  <View style={styles.brandMark}>
                    <Text style={styles.brandMarkText}>S</Text>
                  </View>
                  <View>
                    <Text style={styles.brandTitle}>Suvalgyk</Text>
                    <Text style={styles.brandSubtitle}>neišmesk!</Text>
                  </View>
                </View>
                <Text style={styles.footerDescription}>
                  Suvalgyk – tavo virtuvės padėjėjas ir mažiau švaistymo.
                </Text>
                <Text style={styles.footerCopyright}>
                  © {new Date().getFullYear()} {FOOTER_TEXT.copyright}
                </Text>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>🥄 {FOOTER_TEXT.recipesTitle}</Text>
                <Text style={styles.footerColumnText}>{FOOTER_TEXT.recipesDescription}</Text>
                <Text style={styles.footerLink}>Receptų sąrašas</Text>
              </View>

              <View style={styles.footerColumn}>
                <Text style={styles.footerColumnTitle}>📝 {FOOTER_TEXT.articlesTitle}</Text>
                <Text style={styles.footerColumnText}>{FOOTER_TEXT.articlesDescription}</Text>
                <Text style={styles.footerLink}>Straipsnių archyvas</Text>
              </View>
            </View>

            <View style={styles.footerDivider} />

            <View style={styles.footerBottomBlock}>
              <Text style={styles.footerColumnTitle}>📬 {FOOTER_TEXT.contactTitle}</Text>
              <Text style={styles.footerColumnText}>{FOOTER_TEXT.contactDescription}</Text>
              <Pressable style={styles.emailRow} onPress={showStaticNotice}>
                <View style={styles.emailBadge}>
                  <Text style={styles.emailBadgeText}>✉</Text>
                </View>
                <Text style={styles.emailText}>{FOOTER_TEXT.email}</Text>
              </Pressable>
              <Text style={styles.footerPrivacy}>{FOOTER_TEXT.privacy}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3ecdc' },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#f3ecdc',
  },
  pageFrame: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#1f4d35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  brandTitle: {
    color: '#1a1d1a',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  brandSubtitle: {
    color: '#4a534a',
    fontSize: 12,
    marginTop: 1,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e0d3',
  },
  menuButtonIcon: {
    color: '#1f4d35',
    fontSize: 18,
    fontWeight: '800',
  },
  menuButtonLabel: {
    color: '#1a1d1a',
    fontSize: 13,
    fontWeight: '700',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 24, 20, 0.35)',
    zIndex: 20,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: Math.min(340, Math.max(280, Dimensions.get('window').width * 0.82)),
    backgroundColor: '#fffaf1',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e0d3',
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 24,
    zIndex: 30,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: -8, height: 0 },
    elevation: 12,
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarClosed: {
    transform: [{ translateX: 360 }],
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eef4ed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: '#1f4d35',
    fontSize: 18,
    fontWeight: '800',
  },
  sidebarBrand: {
    color: '#1f4d35',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  sidebarTag: {
    color: '#4a534a',
    fontSize: 12,
    marginTop: 4,
  },
  sidebarLinks: {
    gap: 10,
  },
  sidebarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e0d3',
  },
  sidebarLinkText: {
    color: '#1a1d1a',
    fontSize: 15,
    fontWeight: '700',
  },
  sidebarLinkChevron: {
    color: '#1f4d35',
    fontSize: 22,
    fontWeight: '700',
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#e5e0d3',
    gap: 8,
  },
  sidebarFooterTitle: {
    color: '#1a1d1a',
    fontSize: 16,
    fontWeight: '800',
  },
  sidebarFooterText: {
    color: '#4a534a',
    fontSize: 13,
    lineHeight: 19,
  },
  heroCard: {
    backgroundColor: '#faf6ee',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: '#eadfc6',
    shadowColor: '#1f4d35',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 2,
  },
  heroWide: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heroTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(31, 77, 53, 0.08)',
    marginBottom: 16,
  },
  heroTagDot: {
    color: '#5cb87a',
    fontSize: 20,
    lineHeight: 20,
    marginTop: -2,
  },
  heroTagText: {
    color: '#1f4d35',
    fontWeight: '800',
    fontSize: 13,
  },
  heroTitle: {
    color: '#1a1d1a',
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
    fontWeight: '900',
  },
  heroAccent: {
    color: '#1f4d35',
  },
  heroSubtitle: {
    color: '#4a534a',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 520,
  },
  heroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e0d3',
  },
  heroChipEmoji: {
    fontSize: 16,
  },
  heroChipText: {
    color: '#1a1d1a',
    fontSize: 13,
    fontWeight: '700',
  },
  heroIllustration: {
    marginTop: 20,
    minHeight: 240,
    borderRadius: 24,
    backgroundColor: '#fdf8ea',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingEmoji1: {
    position: 'absolute',
    top: 18,
    left: 20,
    fontSize: 28,
  },
  floatingEmoji2: {
    position: 'absolute',
    top: 18,
    right: 28,
    fontSize: 26,
  },
  floatingEmoji3: {
    position: 'absolute',
    top: 84,
    right: 18,
    fontSize: 26,
  },
  floatingEmoji4: {
    position: 'absolute',
    left: 16,
    top: 92,
    fontSize: 26,
  },
  floatingEmoji5: {
    position: 'absolute',
    bottom: 26,
    right: 28,
    fontSize: 24,
  },
  floatingEmoji6: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    fontSize: 24,
  },
  cookCircle: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: '#fffdf8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#efe0b6',
    shadowColor: '#b89536',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cookEmoji: {
    fontSize: 88,
  },
  heroProof: {
    marginTop: 16,
    color: '#4a534a',
    fontSize: 13,
    fontWeight: '600',
  },
  heroProofStrong: {
    color: '#1f4d35',
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: '#e8f3eb',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d0e2d4',
    gap: 18,
  },
  formTabs: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d7dbd1',
  },
  tabButtonActive: {
    backgroundColor: '#1f4d35',
    borderColor: '#1f4d35',
  },
  tabButtonText: {
    color: '#4a534a',
    fontSize: 14,
    fontWeight: '800',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  sectionGroup: {
    gap: 10,
  },
  sectionLabelRow: {
    gap: 4,
  },
  sectionLabel: {
    color: '#1a1d1a',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionLabelMuted: {
    color: '#4a534a',
    fontSize: 12,
  },
  ingredientTable: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7dbd1',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  ingredientTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f6f8f4',
    borderBottomWidth: 1,
    borderBottomColor: '#d7dbd1',
  },
  ingredientTableHeadCell: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#4a534a',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ingredientRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eef1ea',
  },
  ingredientCell: {
    minHeight: 58,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#eef1ea',
  },
  cellIcon: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellName: {
    flex: 1.4,
  },
  cellAmount: {
    flex: 0.9,
    borderRightWidth: 0,
  },
  ingredientIcon: {
    fontSize: 18,
  },
  ingredientInput: {
    color: '#1a1d1a',
    fontSize: 14,
    paddingVertical: 0,
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d7dbd1',
    alignItems: 'center',
    gap: 10,
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadTitle: {
    color: '#1a1d1a',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  uploadText: {
    color: '#4a534a',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  uploadActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#1f4d35',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d7dbd1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#1a1d1a',
    fontSize: 14,
    fontWeight: '800',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d7dbd1',
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#1a1d1a',
    fontSize: 14,
  },
  multiLineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  mealTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mealChip: {
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d7dbd1',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  mealChipActive: {
    backgroundColor: '#1f4d35',
    borderColor: '#1f4d35',
  },
  mealChipText: {
    color: '#1a1d1a',
    fontSize: 13,
    fontWeight: '800',
  },
  submitButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#1f4d35',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  footerCard: {
    backgroundColor: '#1f4d35',
    borderRadius: 28,
    padding: 18,
    gap: 18,
  },
  footerTopGrid: {
    gap: 16,
  },
  footerBrandBlock: {
    gap: 10,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerDescription: {
    color: '#f4f8f5',
    fontSize: 13,
    lineHeight: 19,
  },
  footerCopyright: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
  },
  footerColumn: {
    gap: 6,
    paddingTop: 4,
  },
  footerColumnTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  footerColumnText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
  },
  footerLink: {
    color: '#f3ecdc',
    fontSize: 13,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  footerBottomBlock: {
    gap: 8,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  emailBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailBadgeText: {
    color: '#1f4d35',
    fontSize: 15,
    fontWeight: '900',
  },
  emailText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  footerPrivacy: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
