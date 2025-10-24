# Panduan Lengkap Menggunakan GitHub

Panduan komprehensif untuk menggunakan GitHub mulai dari instalasi, konfigurasi, hingga workflow kolaborasi.

## Daftar Isi

- [Instalasi dan Konfigurasi Awal](#instalasi-dan-konfigurasi-awal)
- [Membuat Repository](#membuat-repository)
- [Operasi Dasar Git](#operasi-dasar-git)
- [Branching dan Merging](#branching-dan-merging)
- [Kolaborasi dengan Remote Repository](#kolaborasi-dengan-remote-repository)
- [Pull Request](#pull-request)
- [Mengatasi Konflik](#mengatasi-konflik)
- [Tips dan Best Practices](#tips-dan-best-practices)

## Instalasi dan Konfigurasi Awal

### Instalasi Git untuk Windows

1. Download Git dari [git-scm.com](https://git-scm.com/download/win)
2. Jalankan file installer (.exe)
3. Ikuti wizard instalasi dengan pengaturan berikut (yang direkomendasikan):
   - **Select Components:** Centang "Git Bash Here" dan "Git GUI Here"
   - **Default editor:** Pilih editor favorit Anda (VS Code, Notepad++, dll)
   - **PATH environment:** Pilih "Git from the command line and also from 3rd-party software"
   - **HTTPS transport backend:** Pilih "Use the OpenSSL library"
   - **Line ending conversions:** Pilih "Checkout Windows-style, commit Unix-style line endings"
   - **Terminal emulator:** Pilih "Use MinTTY"
4. Klik "Install" dan tunggu hingga selesai
5. Verifikasi instalasi dengan membuka Command Prompt atau Git Bash, lalu ketik:
```bash
git --version
```

### Konfigurasi Identitas

Setelah instalasi, konfigurasikan nama dan email Anda:

```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"
```

Verifikasi konfigurasi:
```bash
git config --list
```

### Setup SSH Key untuk Windows (Opsional tapi Direkomendasikan)

1. Buka **Git Bash** (bukan Command Prompt)
2. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "email@example.com"
```
3. Tekan Enter untuk menyimpan di lokasi default (`C:\Users\NamaAnda\.ssh\id_ed25519`)
4. Buat passphrase atau tekan Enter untuk skip
5. Salin public key dengan perintah:
```bash
clip < ~/.ssh/id_ed25519.pub
```
Atau buka file secara manual di: `C:\Users\NamaAnda\.ssh\id_ed25519.pub`

6. Tambahkan ke GitHub:
   - Buka GitHub → Settings → SSH and GPG keys
   - Klik "New SSH key"
   - Paste key yang sudah dicopy
   - Klik "Add SSH key"

7. Test koneksi:
```bash
ssh -T git@github.com
```

## Membuat Repository

### Membuat Repository Baru di GitHub

1. Klik tombol **"New"** atau **"+"** di pojok kanan atas
2. Isi nama repository
3. Pilih visibility (Public/Private)
4. Opsional: tambahkan README, .gitignore, dan license
5. Klik **"Create repository"**

### Menginisialisasi Repository Lokal

Untuk proyek baru:
```bash
mkdir nama-proyek
cd nama-proyek
git init
```

Untuk clone repository yang sudah ada:
```bash
git clone https://github.com/username/nama-repo.git
```

Atau dengan SSH:
```bash
git clone git@github.com:username/nama-repo.git
```

## Operasi Dasar Git

### Melihat Status

Cek status file dalam working directory:
```bash
git status
```

### Menambahkan File (Staging)

Tambahkan file spesifik:
```bash
git add nama-file.txt
```

Tambahkan semua file:
```bash
git add .
```

Tambahkan semua file dengan ekstensi tertentu:
```bash
git add *.js
```

### Commit Perubahan

Commit dengan pesan:
```bash
git commit -m "Pesan commit yang deskriptif"
```

Commit dengan pesan multi-baris:
```bash
git commit -m "Judul commit" -m "Deskripsi detail perubahan"
```

Tambah dan commit sekaligus (hanya untuk file yang sudah di-track):
```bash
git commit -am "Pesan commit"
```

### Melihat History

Lihat riwayat commit:
```bash
git log
```

Lihat log dalam format ringkas:
```bash
git log --oneline
```

Lihat log dengan grafik branch:
```bash
git log --oneline --graph --all
```

### Melihat Perubahan

Lihat perubahan yang belum di-stage:
```bash
git diff
```

Lihat perubahan yang sudah di-stage:
```bash
git diff --staged
```

### Membatalkan Perubahan

Membatalkan perubahan file yang belum di-stage:
```bash
git checkout -- nama-file.txt
```

Atau dengan perintah baru:
```bash
git restore nama-file.txt
```

Unstage file (membatalkan git add):
```bash
git reset HEAD nama-file.txt
```

Atau dengan perintah baru:
```bash
git restore --staged nama-file.txt
```

Membatalkan commit terakhir (tetapi perubahan tetap ada):
```bash
git reset --soft HEAD~1
```

Membatalkan commit dan perubahan:
```bash
git reset --hard HEAD~1
```

## Branching dan Merging

### Membuat dan Mengelola Branch

Lihat semua branch:
```bash
git branch
```

Lihat branch termasuk remote:
```bash
git branch -a
```

Membuat branch baru:
```bash
git branch nama-branch
```

Pindah ke branch lain:
```bash
git checkout nama-branch
```

Atau dengan perintah baru:
```bash
git switch nama-branch
```

Membuat dan pindah ke branch baru sekaligus:
```bash
git checkout -b nama-branch-baru
```

Atau:
```bash
git switch -c nama-branch-baru
```

Menghapus branch lokal:
```bash
git branch -d nama-branch
```

Force delete branch:
```bash
git branch -D nama-branch
```

### Merging Branch

Pindah ke branch tujuan (biasanya main/master):
```bash
git checkout main
```

Merge branch lain ke branch saat ini:
```bash
git merge nama-branch
```

Merge dengan pesan commit:
```bash
git merge nama-branch -m "Pesan merge"
```

### Rebase (Alternatif Merge)

Rebase branch saat ini dengan branch lain:
```bash
git rebase main
```

Melanjutkan rebase setelah resolve conflict:
```bash
git rebase --continue
```

Membatalkan rebase:
```bash
git rebase --abort
```

## Kolaborasi dengan Remote Repository

### Menghubungkan dengan Remote

Tambah remote repository:
```bash
git remote add origin https://github.com/username/nama-repo.git
```

Atau dengan SSH:
```bash
git remote add origin git@github.com:username/nama-repo.git
```

Lihat daftar remote:
```bash
git remote -v
```

Ubah URL remote:
```bash
git remote set-url origin https://github.com/username/repo-baru.git
```

### Push ke Remote

Push branch pertama kali:
```bash
git push -u origin main
```

Push setelah setup:
```bash
git push
```

Push branch spesifik:
```bash
git push origin nama-branch
```

Push semua branch:
```bash
git push --all
```

Force push (hati-hati!):
```bash
git push -f
```

### Pull dari Remote

Pull perubahan dari remote:
```bash
git pull
```

Pull dengan rebase:
```bash
git pull --rebase
```

Pull dari branch spesifik:
```bash
git pull origin nama-branch
```

### Fetch

Fetch tanpa merge:
```bash
git fetch
```

Fetch dari remote spesifik:
```bash
git fetch origin
```

Fetch dan prune branch yang sudah dihapus:
```bash
git fetch -p
```

### Clone Repository

Clone repository:
```bash
git clone https://github.com/username/nama-repo.git
```

Clone dengan nama folder berbeda:
```bash
git clone https://github.com/username/nama-repo.git nama-folder
```

Clone branch spesifik:
```bash
git clone -b nama-branch https://github.com/username/nama-repo.git
```

## Pull Request

### Cara Membuat Pull Request

1. **Fork repository** (jika tidak punya akses langsung):
   - Klik tombol "Fork" di repository GitHub
   
2. **Clone fork Anda**:
```bash
git clone https://github.com/username-anda/nama-repo.git
cd nama-repo
```

3. **Buat branch baru untuk fitur/fix**:
```bash
git checkout -b fitur-baru
```

4. **Buat perubahan dan commit**:
```bash
git add .
git commit -m "Menambahkan fitur baru"
```

5. **Push ke GitHub**:
```bash
git push origin fitur-baru
```

6. **Buat Pull Request di GitHub**:
   - Buka repository di GitHub
   - Klik "Compare & pull request"
   - Isi judul dan deskripsi PR
   - Klik "Create pull request"

### Update Fork dari Upstream

Tambah upstream remote:
```bash
git remote add upstream https://github.com/original-owner/nama-repo.git
```

Fetch dan merge dari upstream:
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Mengatasi Konflik

### Saat Merge Conflict

1. Git akan menandai file yang konflik
2. Buka file tersebut, akan ada marker seperti:
```
<<<<<<< HEAD
Kode Anda
=======
Kode dari branch lain
>>>>>>> nama-branch
```

3. Edit file, hapus marker, pilih kode yang benar
4. Setelah selesai:
```bash
git add nama-file.txt
git commit -m "Resolve merge conflict"
```

### Saat Pull/Rebase Conflict

Sama seperti merge conflict, setelah resolve:
```bash
git add .
git rebase --continue
```

Atau untuk pull:
```bash
git add .
git commit -m "Resolve conflict"
```

## Tips dan Best Practices

### Menulis Commit Message yang Baik

Format yang direkomendasikan:
```
Judul singkat (maksimal 50 karakter)

Deskripsi detail apa yang berubah dan kenapa.
Gunakan bullet points jika perlu:
- Poin pertama
- Poin kedua

Fixes #123
```

Gunakan verb imperatif: "Add", "Fix", "Update", bukan "Added", "Fixed"

### File .gitignore

Buat file `.gitignore` untuk mengabaikan file yang tidak perlu di-track:

```
# Dependencies
node_modules/
vendor/

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
*.log
```

### Perintah Berguna Lainnya

Membersihkan untracked files:
```bash
git clean -fd
```

Melihat siapa yang mengubah baris kode:
```bash
git blame nama-file.txt
```

Mencari commit dengan keyword:
```bash
git log --grep="keyword"
```

Menyimpan perubahan sementara (stash):
```bash
git stash
git stash list
git stash apply
git stash pop
git stash drop
```

Membuat tag/release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Melihat perubahan antara dua commit:
```bash
git diff commit1 commit2
```

### Workflow Rekomendasi

**Git Flow untuk Tim:**

1. `main/master` - Branch produksi
2. `develop` - Branch development
3. `feature/*` - Branch untuk fitur baru
4. `hotfix/*` - Branch untuk bug fix mendesak

**Langkah kerja:**
```bash
# Mulai fitur baru
git checkout develop
git pull
git checkout -b feature/nama-fitur

# Kerjakan fitur
git add .
git commit -m "Add: deskripsi fitur"

# Update dari develop
git checkout develop
git pull
git checkout feature/nama-fitur
git merge develop

# Push dan buat PR
git push origin feature/nama-fitur
```

### Perintah Windows-Specific

**Menggunakan Git Bash vs CMD/PowerShell:**

Git Bash (direkomendasikan untuk Windows):
- Lebih mirip Linux/Mac
- Support perintah Unix seperti `ls`, `cat`, `grep`

CMD/PowerShell:
- Perlu gunakan perintah Windows (`dir` bukan `ls`, `type` bukan `cat`)
- Beberapa perintah Git tetap sama

**Path di Windows:**
```bash
# Git Bash menggunakan forward slash
cd /c/Users/NamaAnda/Projects

# CMD menggunakan backslash
cd C:\Users\NamaAnda\Projects
```

### Credential Manager di Windows

Windows akan menyimpan kredensial GitHub secara otomatis. Untuk mengelola:

1. Buka "Credential Manager" di Control Panel
2. Pilih "Windows Credentials"
3. Cari "git:https://github.com"
4. Edit atau hapus jika perlu update

Atau gunakan command:
```bash
git config --global credential.helper manager
```

---

## Sumber Belajar Tambahan

- [Dokumentasi Git Official](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2) (Gratis)
- [GitHub Learning Lab](https://lab.github.com/)

## Bantuan

Jika mengalami masalah, gunakan:
```bash
git help <command>
# Contoh:
git help commit
git help push
```

---

**Happy Coding! 🚀**

Li
