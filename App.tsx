import React, { useMemo, useState } from "react";
import {
  Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from "react-native";

type Tab = "home" | "updates" | "report" | "admin";
type Notice = { id: number; title: string; body: string; date: string; urgent?: boolean };
const initialNotices: Notice[] = [
  { id: 1, title: "ברוכים הבאים למרכז העדכונים", body: "כאן יופיעו הודעות ועדכונים רשמיים שמפרסם מנהל המערכת.", date: "היום" },
  { id: 2, title: "בדיקת פרטי קשר", body: "מומלץ לוודא שפרטי הקשר בחשבון מעודכנים. אין לפרסם כאן מידע אישי של אחרים.", date: "השבוע" }
];
const palette = { navy: "#123B6D", blue: "#2474C8", bg: "#F4F7FB", ink: "#17283E", muted: "#718096", line: "#E3EAF2", white: "#FFFFFF", red: "#C83D45", green: "#18845B" };

function PrimaryButton({ title, onPress, secondary = false }: { title: string; onPress: () => void; secondary?: boolean }) {
  return <TouchableOpacity accessibilityRole="button" onPress={onPress} style={[styles.button, secondary && styles.buttonSecondary]}><Text style={[styles.buttonText, secondary && styles.buttonSecondaryText]}>{title}</Text></TouchableOpacity>;
}
function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <View style={styles.header}><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.heading}>{title}</Text></View>;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [notices, setNotices] = useState(initialNotices);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [reportType, setReportType] = useState("מפגע בטיחותי");
  const [reportText, setReportText] = useState("");
  const [reports, setReports] = useState<string[]>([]);
  const [pending, setPending] = useState(["משתמש לדוגמה א׳", "משתמש לדוגמה ב׳"]);
  const unread = useMemo(() => notices.length, [notices]);

  const publish = () => {
    if (!draftTitle.trim() || !draftBody.trim()) { Alert.alert("חסרים פרטים", "יש למלא כותרת ותוכן לעדכון."); return; }
    setNotices([{ id: Date.now(), title: draftTitle.trim(), body: draftBody.trim(), date: "הרגע" }, ...notices]);
    setDraftTitle(""); setDraftBody(""); Alert.alert("נוסף לעדכונים", "ההודעה נוספה לתצוגה המקומית.");
  };
  const sendReport = () => {
    if (reportText.trim().length < 8) { Alert.alert("צריך עוד מידע", "נא לכתוב תיאור קצר וברור."); return; }
    setReports([reportType + ": " + reportText.trim(), ...reports]); setReportText("");
    Alert.alert("הדיווח נשמר במכשיר", "זהו אבטיפוס מקומי בלבד; הדיווח עדיין לא נשלח למנהל או לחברי צוות.");
  };
  const approve = (name: string) => { setPending(pending.filter(x => x !== name)); Alert.alert("אישור הדגמה", name + " הוסר מרשימת ההמתנה המקומית. לא נוצר חשבון אמיתי."); };

  const nav = (key: Tab, label: string, icon: string) => (
    <TouchableOpacity accessibilityRole="button" onPress={() => setTab(key)} style={[styles.navItem, tab === key && styles.navActive]}>
      <Text style={[styles.navIcon, tab === key && styles.navTextActive]}>{icon}</Text>
      <Text style={[styles.navLabel, tab === key && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.bg} />
      <View style={styles.topbar}><View style={styles.brandMark}><Text style={styles.brandMarkText}>כ</Text></View><View style={{ flex: 1 }}><Text style={styles.brand}>כוננות</Text><Text style={styles.brandSub}>קהילה מעודכנת ובטוחה</Text></View><View style={styles.statusPill}><View style={styles.statusDot}/><Text style={styles.statusText}>מערכת הדגמה</Text></View></View>
      <ScrollView contentContainerStyle={styles.content}>
        {tab === "home" && <>
          <Header eyebrow="מרכז הקהילה" title="שלום וברוכים הבאים" />
          <Card style={styles.hero}><Text style={styles.heroTag}>מרכז מידע ועדכונים</Text><Text style={styles.heroTitle}>נשארים מעודכנים יחד.</Text><Text style={styles.heroBody}>הודעות חשובות, מידע קהילתי ודיווח על מפגעי בטיחות — במקום אחד.</Text><PrimaryButton title="לצפייה בעדכונים ←" onPress={() => setTab("updates")} /></Card>
          <View style={styles.statsRow}><Card style={styles.stat}><Text style={styles.statNumber}>{unread}</Text><Text style={styles.statLabel}>עדכונים</Text></Card><Card style={styles.stat}><Text style={styles.statNumber}>{reports.length}</Text><Text style={styles.statLabel}>דיווחים במכשיר</Text></Card></View>
          <Text style={styles.sectionTitle}>מה אפשר לעשות?</Text>
          <TouchableOpacity onPress={() => setTab("updates")} style={styles.actionCard}><Text style={styles.actionIcon}>📢</Text><View style={styles.actionCopy}><Text style={styles.actionTitle}>מרכז העדכונים</Text><Text style={styles.actionDesc}>הודעות והנחיות כלליות ממנהלי המערכת</Text></View><Text style={styles.chevron}>‹</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("report")} style={styles.actionCard}><Text style={styles.actionIcon}>📝</Text><View style={styles.actionCopy}><Text style={styles.actionTitle}>דיווח בטיחותי</Text><Text style={styles.actionDesc}>דיווח על מפגעים או צורך בסיוע קהילתי</Text></View><Text style={styles.chevron}>‹</Text></TouchableOpacity>
          <Card style={styles.infoCard}><Text style={styles.infoTitle}>🔒 שומרים על פרטיות</Text><Text style={styles.infoText}>אין להזין מיקומים מדויקים, פרטי פריסה, תנועות אנשים או מידע מבצעי רגיש.</Text></Card>
        </>}
        {tab === "updates" && <>
          <Header eyebrow="מידע רשמי" title="מרכז העדכונים" />
          <Text style={styles.subheading}>עדכונים כלליים שמופיעים באפליקציה</Text>
          {notices.map(n => <Card key={n.id} style={styles.notice}><View style={styles.noticeTop}><Text style={styles.date}>{n.date}</Text>{n.urgent && <Text style={styles.urgent}>חשוב</Text>}</View><Text style={styles.noticeTitle}>{n.title}</Text><Text style={styles.noticeBody}>{n.body}</Text></Card>)}
          {notices.length === 0 && <Card><Text style={styles.empty}>אין עדכונים כרגע.</Text></Card>}
        </>}
        {tab === "report" && <>
          <Header eyebrow="שומרים על הסביבה" title="דיווח בטיחותי" />
          <Card><Text style={styles.fieldLabel}>סוג הדיווח</Text><View style={styles.chips}>{["מפגע בטיחותי", "תאורה / תשתית", "סיוע קהילתי", "אחר"].map(x => <TouchableOpacity key={x} onPress={() => setReportType(x)} style={[styles.chip, reportType === x && styles.chipSelected]}><Text style={[styles.chipText, reportType === x && styles.chipTextSelected]}>{x}</Text></TouchableOpacity>)}</View><Text style={styles.fieldLabel}>תיאור כללי</Text><TextInput value={reportText} onChangeText={setReportText} multiline textAlign="right" placeholder="תארו את המפגע בלי לציין מיקום מדויק או מידע מבצעי..." placeholderTextColor="#98A5B5" style={[styles.input, styles.multiline]} /><Text style={styles.helper}>אין לכלול מיקום מדויק, שמות של אנשים, מיקומי צוותים או פרטי פעילות.</Text><PrimaryButton title="שמירת דיווח במכשיר" onPress={sendReport} /></Card>
          <Card style={styles.infoCard}><Text style={styles.infoTitle}>לתשומת לבכם</Text><Text style={styles.infoText}>בגרסה זו הדיווח נשמר במכשיר בלבד. אין כאן שליחת קריאה או הזעקת כוחות.</Text></Card>
        </>}
        {tab === "admin" && <>
          <Header eyebrow="ניהול מערכת" title="כלי מנהל" />
          <Card><Text style={styles.cardTitle}>פרסום עדכון חדש</Text><Text style={styles.fieldLabel}>כותרת</Text><TextInput value={draftTitle} onChangeText={setDraftTitle} textAlign="right" placeholder="לדוגמה: עדכון קהילתי" style={styles.input} /><Text style={styles.fieldLabel}>תוכן ההודעה</Text><TextInput value={draftBody} onChangeText={setDraftBody} multiline textAlign="right" placeholder="כתבו הודעה כללית וברורה..." style={[styles.input, styles.multiline]} /><PrimaryButton title="פרסום במרכז העדכונים" onPress={publish} /></Card>
          <Card><Text style={styles.cardTitle}>בקשות הצטרפות · נתוני הדגמה</Text><Text style={styles.helper}>אישור זה מקומי בלבד. נדרש שרת מאובטח כדי לנהל משתמשים והרשאות אמיתיים.</Text>{pending.map(name => <View key={name} style={styles.pendingRow}><Text style={styles.pendingName}>{name}</Text><TouchableOpacity onPress={() => approve(name)} style={styles.approve}><Text style={styles.approveText}>אישור הדגמה</Text></TouchableOpacity></View>)}{pending.length === 0 && <Text style={styles.empty}>אין בקשות ממתינות.</Text>}</Card>
          <Card style={styles.infoCard}><Text style={styles.infoTitle}>ניהול מאובטח — שלב הבא</Text><Text style={styles.infoText}>לפני שימוש אמיתי יש להוסיף התחברות מאובטחת, הרשאות בצד השרת, יומן פעולות, גיבויים ובדיקות אבטחה.</Text></Card>
        </>}
      </ScrollView>
      <View style={styles.bottomNav}>{nav("home","בית","⌂")}{nav("updates","עדכונים","▤")}{nav("report","דיווח","＋")}{nav("admin","ניהול","⚙")}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  topbar: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12, backgroundColor: palette.white, borderBottomWidth: 1, borderBottomColor: palette.line, gap: 10 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: palette.navy, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#fff", fontSize: 24, fontWeight: "900" },
  brand: { color: palette.ink, fontSize: 17, fontWeight: "900", textAlign: "right" },
  brandSub: { color: palette.muted, fontSize: 11, textAlign: "right", marginTop: 2 },
  statusPill: { flexDirection: "row-reverse", alignItems: "center", gap: 6, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 20, backgroundColor: "#FFF4E5" },
  statusDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: "#D88A24" },
  statusText: { fontSize: 10, color: "#94611F", fontWeight: "700" },
  content: { padding: 18, paddingBottom: 28, gap: 14 },
  header: { alignItems: "flex-end", marginTop: 8, marginBottom: 4 },
  eyebrow: { color: palette.blue, fontSize: 12, fontWeight: "800", marginBottom: 5, textAlign: "right" },
  heading: { color: palette.ink, fontSize: 27, fontWeight: "900", textAlign: "right" },
  card: { backgroundColor: palette.white, borderRadius: 20, padding: 17, borderWidth: 1, borderColor: palette.line, marginBottom: 2 },
  hero: { backgroundColor: palette.navy, borderColor: palette.navy, padding: 22, gap: 10 },
  heroTag: { color: "#BBD9FF", fontSize: 12, fontWeight: "800", textAlign: "right" },
  heroTitle: { color: "#FFFFFF", fontSize: 25, fontWeight: "900", textAlign: "right" },
  heroBody: { color: "#DCEBFA", fontSize: 14, lineHeight: 22, textAlign: "right", marginBottom: 8 },
  button: { minHeight: 48, backgroundColor: palette.blue, borderRadius: 13, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, marginTop: 8 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  buttonSecondary: { backgroundColor: "#EAF2FB" },
  buttonSecondaryText: { color: palette.navy },
  statsRow: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statNumber: { color: palette.navy, fontSize: 25, fontWeight: "900" },
  statLabel: { color: palette.muted, fontSize: 12, marginTop: 3 },
  sectionTitle: { color: palette.ink, fontWeight: "900", fontSize: 17, textAlign: "right", marginTop: 4 },
  actionCard: { flexDirection: "row-reverse", alignItems: "center", backgroundColor: palette.white, borderRadius: 16, borderWidth: 1, borderColor: palette.line, padding: 15, gap: 12, minHeight: 76 },
  actionIcon: { fontSize: 24, width: 42, textAlign: "center" },
  actionCopy: { flex: 1 },
  actionTitle: { color: palette.ink, fontSize: 14, fontWeight: "900", textAlign: "right" },
  actionDesc: { color: palette.muted, fontSize: 11, textAlign: "right", marginTop: 4 },
  chevron: { color: palette.blue, fontSize: 26 },
  infoCard: { backgroundColor: "#EEF5FC", borderColor: "#D7E7F8" },
  infoTitle: { color: palette.navy, fontSize: 14, fontWeight: "900", textAlign: "right", marginBottom: 6 },
  infoText: { color: "#52677F", fontSize: 12, lineHeight: 19, textAlign: "right" },
  subheading: { color: palette.muted, textAlign: "right", fontSize: 13, marginBottom: 3 },
  notice: { gap: 8 },
  noticeTop: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  date: { color: palette.muted, fontSize: 11 },
  urgent: { color: palette.red, backgroundColor: "#FDEEEF", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8, fontSize: 10, fontWeight: "800" },
  noticeTitle: { color: palette.ink, fontSize: 16, fontWeight: "900", textAlign: "right" },
  noticeBody: { color: "#596B80", fontSize: 13, lineHeight: 21, textAlign: "right" },
  empty: { color: palette.muted, textAlign: "right", padding: 12 },
  fieldLabel: { color: palette.ink, fontSize: 13, fontWeight: "800", textAlign: "right", marginTop: 12, marginBottom: 7 },
  chips: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 7 },
  chip: { borderWidth: 1, borderColor: palette.line, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: "#fff" },
  chipSelected: { backgroundColor: "#EAF2FB", borderColor: palette.blue },
  chipText: { color: palette.muted, fontSize: 11, fontWeight: "700" },
  chipTextSelected: { color: palette.navy },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#DCE4ED", borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, color: palette.ink, fontSize: 14, backgroundColor: "#FCFDFE" },
  multiline: { minHeight: 112, textAlignVertical: "top" },
  helper: { color: palette.muted, fontSize: 11, lineHeight: 17, textAlign: "right", marginTop: 8 },
  cardTitle: { color: palette.ink, fontSize: 16, fontWeight: "900", textAlign: "right", marginBottom: 6 },
  pendingRow: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 12, marginTop: 12 },
  pendingName: { color: palette.ink, fontSize: 13, fontWeight: "700" },
  approve: { backgroundColor: "#E7F6EF", paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10, minHeight: 40, justifyContent: "center" },
  approveText: { color: palette.green, fontSize: 11, fontWeight: "900" },
  bottomNav: { flexDirection: "row-reverse", backgroundColor: palette.white, borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 7, paddingBottom: 6 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 5, gap: 3, minHeight: 48 },
  navActive: { backgroundColor: "#EDF4FC", borderRadius: 12, marginHorizontal: 4 },
  navIcon: { color: "#8292A6", fontSize: 20, fontWeight: "700" },
  navLabel: { color: "#8292A6", fontSize: 10, fontWeight: "700" },
  navTextActive: { color: palette.blue }
});