# Multi-Stage Build: Das Image wird in 3 Phasen gebaut.
# Vorteil: Das finale Image enthält nur das, was zur Laufzeit wirklich gebraucht wird –
# keine Build-Tools, keine Dev-Dependencies, kein Quellcode. Ergebnis: kleines, sicheres Image.

# =============================================================================
# Stage 1: Dependencies
# Installiert nur die npm-Pakete. Diese Stage existiert nur als Zwischenschritt –
# ihr Ergebnis (node_modules) wird in Stage 2 kopiert, sie selbst landet
# nicht im finalen Image.
# =============================================================================
FROM node:20-alpine AS deps
# node:20-alpine = Node.js 20 auf Alpine Linux (sehr schlanke Linux-Variante, ~5 MB)
# AS deps = Name dieser Stage, damit spätere Stages darauf verweisen können

WORKDIR /app
# Arbeitsverzeichnis im Container setzen – alle folgenden Befehle laufen relativ zu /app

COPY package.json ./
# Nur package.json kopieren (nicht den ganzen Code), damit Docker den
# npm-install-Layer cachen kann: Ändert sich nur der Code (nicht package.json),
# muss npm install beim nächsten Build nicht erneut laufen.

RUN npm install
# Installiert alle Abhängigkeiten aus package.json in node_modules


# =============================================================================
# Stage 2: Builder
# Kompiliert die Next.js-App. Braucht den Quellcode + node_modules aus Stage 1.
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# node_modules aus Stage 1 (deps) hierher kopieren – nicht neu installieren

COPY . .
# Den gesamten Quellcode ins Image kopieren (was .dockerignore nicht ausschließt)

RUN npm run build
# Next.js kompilieren → erzeugt .next/standalone (fertiger Server) + .next/static (Assets)


# =============================================================================
# Stage 3: Runner (das finale Image)
# Enthält nur den kompilierten Output – kein Quellcode, keine Dev-Tools.
# Dieses Image wird tatsächlich deployed und gestartet.
# =============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Node.js und Next.js verhalten sich im Production-Modus anders:
# kein Hot-Reload, keine detaillierten Fehlermeldungen nach außen, bessere Performance

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs
# Sicherheit: Einen eigenen System-User "nextjs" anlegen.
# Der Container läuft NICHT als root – das ist Best Practice, weil ein
# kompromittierter Prozess dann keine root-Rechte im Container hat.

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Den kompilierten Next.js-Server aus Stage 2 kopieren.
# --chown=nextjs:nodejs = Dateien gehören dem neuen User, nicht root

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Die statischen Assets (JS, CSS, Bilder) separat kopieren –
# Next.js erwartet sie unter .next/static relativ zum Server

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# public/ muss explizit kopiert werden – standalone kopiert es nicht automatisch

USER nextjs
# Ab hier läuft alles als "nextjs"-User, nicht mehr als root

EXPOSE 3000
# Dokumentiert, dass der Container auf Port 3000 lauscht.
# (Nur Dokumentation – der eigentliche Port wird per ENV oder docker-compose gesetzt)

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# 0.0.0.0 = auf allen Netzwerk-Interfaces lauschen, nicht nur localhost.
# Ohne das wäre der Server von außen (z.B. vom Host-Rechner) nicht erreichbar.

CMD ["node", "server.js"]
# Startbefehl wenn der Container läuft.
# server.js ist der von Next.js generierte standalone-Server (in .next/standalone/).
