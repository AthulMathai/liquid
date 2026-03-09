# Liquidation Hub

A modern liquidation inventory and marketplace operations system built with **Next.js**, **Netlify**, and **Supabase**.

This app is designed for short-cycle liquidation workflows where you need to:

- import inventory from CSV
- scan products by SKU or barcode
- capture and upload product images
- manage inventory and reservations
- track orders
- track inquiries
- manage marketplace listing status

---

## Core idea

The whole system is built around a **single product record per SKU**.

That means every workflow connects back to the same item:

- inventory
- images
- listing status
- inquiries
- orders

The goal is to make liquidation selling fast, accurate, and easy to manage.

---

## Tech stack

- **Next.js**
- **React**
- **TypeScript**
- **Netlify Functions**
- **Supabase Database**
- **Supabase Storage**
- **Tailwind CSS**
- **PapaParse**
- **html5-qrcode** or **ZXing** for scanning later

---

## Main features planned

### Version 1
- CSV inventory import
- products dashboard
- scan by SKU / barcode
- product detail page
- image capture / upload
- save images under product SKU
- basic order tracking
- inventory reservation and deduction

### Version 2
- marketplace listing tracker
- buyer inquiry tracker
- dashboard analytics
- local image mirror/export helper
- better mobile intake workflow
- barcode label printing

---

## Product workflow

The intended intake flow is:

1. import CSV
2. products appear in catalog
3. scan product
4. product page opens
5. capture images
6. save images under SKU
7. list product on marketplaces
8. create order when sold
9. reserve / deduct inventory

---

## Project structure

```text
liquidation-hub/
├── netlify/
│   └── functions/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── storage.sql
├── scripts/
├── .env.example
├── netlify.toml
├── package.json
├── tsconfig.json
└── README.md