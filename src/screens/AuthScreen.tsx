import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConsentCheck } from '../components/ConsentCheck';
import { LocaleIcons } from '../components/LocaleIcons';
import { Button, Display } from '../components/ui';
import { minimumAgeForCountry } from '../data/legal';
import { useAuth } from '../store/auth';
import { useKitchen } from '../store/kitchen';
import { colors, fonts, radius } from '../theme';

export function AuthScreen({
  onOpenLegal,
}: {
  onOpenLegal: (doc: 'privacy' | 'terms') => void;
}) {
  const register = useAuth((s) => s.register);
  const login = useAuth((s) => s.login);
  const wipeDevice = useAuth((s) => s.wipeDevice);
  const country = useKitchen((s) => s.settings.country ?? 'US');
  const minAge = minimumAgeForCountry(country);

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ageOk, setAgeOk] = useState(false);
  const [privacyOk, setPrivacyOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wipeAsk, setWipeAsk] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const issue =
      mode === 'register'
        ? await register({
            email,
            password,
            confirm,
            name,
            country,
            ageOk,
            privacyOk,
            termsOk,
          })
        : await login({ email, password });
    setBusy(false);
    if (issue) setError(issue);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Text style={styles.kicker}>A dinner account, not a tracking profile</Text>
        <LocaleIcons />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Display italic>Tonight.</Display>
        <Text style={styles.lede}>
          Create an account to keep this kitchen yours. Data stays on this device. You can export or
          delete it whenever you want.
        </Text>

        <View style={styles.switch}>
          <Pressable
            onPress={() => {
              setMode('register');
              setError(null);
            }}
            style={[styles.switchBtn, mode === 'register' && styles.switchOn]}
          >
            <Text style={[styles.switchText, mode === 'register' && styles.switchTextOn]}>
              Register
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode('login');
              setError(null);
            }}
            style={[styles.switchBtn, mode === 'login' && styles.switchOn]}
          >
            <Text style={[styles.switchText, mode === 'login' && styles.switchTextOn]}>Log in</Text>
          </Pressable>
        </View>

        {mode === 'register' ? (
          <Field
            label="Name (optional)"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            placeholder="What should we call you"
          />
        ) : null}
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@kitchen.com"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secure
          autoComplete={mode === 'register' ? 'new-password' : 'password'}
          placeholder={mode === 'register' ? '8+ characters, letter and number' : 'Your password'}
        />
        {mode === 'register' ? (
          <Field
            label="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            secure
            autoComplete="new-password"
            placeholder="Type it again"
          />
        ) : null}

        {mode === 'register' ? (
          <View style={styles.consents}>
            <ConsentCheck
              checked={ageOk}
              onToggle={() => setAgeOk((value) => !value)}
              accessibilityLabel={`I am at least ${minAge} years old`}
              label={
                <Text style={styles.consentText}>
                  I am at least {minAge} years old
                  {minAge === 16 ? ' (required in the UK, EU, and EEA)' : ''}.
                </Text>
              }
            />
            <ConsentCheck
              checked={privacyOk}
              onToggle={() => setPrivacyOk((value) => !value)}
              accessibilityLabel="I have read the privacy policy"
              label={
                <Text style={styles.consentText}>
                  I have read the{' '}
                  <Text style={styles.link} onPress={() => onOpenLegal('privacy')}>
                    privacy policy
                  </Text>
                  . Boxes are off until you tick them.
                </Text>
              }
            />
            <ConsentCheck
              checked={termsOk}
              onToggle={() => setTermsOk((value) => !value)}
              accessibilityLabel="I agree to the terms of use"
              label={
                <Text style={styles.consentText}>
                  I agree to the{' '}
                  <Text style={styles.link} onPress={() => onOpenLegal('terms')}>
                    terms of use
                  </Text>
                  .
                </Text>
              }
            />
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          label={busy ? 'One moment…' : mode === 'register' ? 'Create account' : 'Log in'}
          onPress={() => void submit()}
          disabled={busy}
        />

        {mode === 'login' ? (
          <View style={styles.forgot}>
            {wipeAsk ? (
              <>
                <Text style={styles.wipeCopy}>
                  This cannot send a reset email. Erasing local Tonight data deletes accounts and
                  kitchens on this device.
                </Text>
                <Button
                  variant="ghost"
                  label="Erase local data"
                  onPress={() => {
                    void wipeDevice();
                    setWipeAsk(false);
                    setError(null);
                  }}
                />
                <Pressable onPress={() => setWipeAsk(false)}>
                  <Text style={styles.link}>Keep the data</Text>
                </Pressable>
              </>
            ) : (
              <Pressable onPress={() => setWipeAsk(true)}>
                <Text style={styles.forgotLink}>Cannot sign in on this device?</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <Text style={styles.foot}>
            Country (flag) only sets the age rule. Currency (symbol) is separate, for Saved totals.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboardType,
  autoComplete,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: 'email-address' | 'default';
  autoComplete?: 'email' | 'password' | 'new-password' | 'name';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkSoft}
        secureTextEntry={secure}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        textContentType={
          secure ? 'password' : keyboardType === 'email-address' ? 'emailAddress' : 'none'
        }
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 12,
  },
  kicker: { fontFamily: fonts.sansSemi, color: colors.inkSoft, flex: 1, fontSize: 12 },
  scroll: { padding: 20, paddingBottom: 40, gap: 12 },
  lede: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 16, lineHeight: 23 },
  switch: { flexDirection: 'row', gap: 8, marginTop: 4 },
  switchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.cream,
  },
  switchOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  switchText: { fontFamily: fonts.sansSemi, color: colors.ink },
  switchTextOn: { color: colors.cream },
  field: { gap: 6 },
  fieldLabel: { fontFamily: fonts.sansSemi, color: colors.ink, fontSize: 14 },
  input: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
  },
  consents: { gap: 10, marginTop: 4 },
  consentText: { fontFamily: fonts.sans, color: colors.ink, fontSize: 14, lineHeight: 20 },
  link: { fontFamily: fonts.sansSemi, color: colors.terracotta },
  error: { fontFamily: fonts.sansSemi, color: colors.terracottaDeep },
  foot: { fontFamily: fonts.sans, color: colors.inkSoft, fontSize: 13, lineHeight: 19 },
  forgot: { gap: 10, marginTop: 4 },
  forgotLink: { fontFamily: fonts.sansSemi, color: colors.inkSoft, fontSize: 14 },
  wipeCopy: { fontFamily: fonts.sans, color: colors.inkSoft, lineHeight: 21 },
});
