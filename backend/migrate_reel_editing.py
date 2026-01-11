"""
Database Migration: Add frame editing columns to reels table

Adds columns for smart mini video editor:
- frame_type: Frame layout selection
- text_overlays: JSON array of text overlay configurations
- has_shadow/shadow_intensity: Shadow effects
- has_overlay/overlay_opacity: Color overlay effects
- is_edited: Track user customization
- original_file_path: Backup of original render

Run with: python migrate_reel_editing.py
"""

import sqlite3
import sys
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent / "gravixai.db"

def migrate():
    """Apply migration to add frame editing columns"""
    if not DB_PATH.exists():
        print(f"Error: Database not found at {DB_PATH}")
        sys.exit(1)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("🔄 Starting migration: Add frame editing columns to reels table")
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(reels)")
        columns = [col[1] for col in cursor.fetchall()]
        
        migrations_needed = []
        
        if 'frame_type' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN frame_type VARCHAR(50) DEFAULT 'CENTER_STRIP' NOT NULL"
            )
        
        if 'text_overlays' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN text_overlays JSON"
            )
        
        if 'has_shadow' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN has_shadow BOOLEAN DEFAULT 0"
            )
        
        if 'shadow_intensity' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN shadow_intensity FLOAT DEFAULT 0.3"
            )
        
        if 'has_overlay' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN has_overlay BOOLEAN DEFAULT 0"
            )
        
        if 'overlay_opacity' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN overlay_opacity FLOAT DEFAULT 0.1"
            )
        
        if 'is_edited' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN is_edited BOOLEAN DEFAULT 0"
            )
        
        if 'original_file_path' not in columns:
            migrations_needed.append(
                "ALTER TABLE reels ADD COLUMN original_file_path VARCHAR(500)"
            )
        
        if not migrations_needed:
            print("✅ All columns already exist. No migration needed.")
            return
        
        # Execute migrations
        for i, sql in enumerate(migrations_needed, 1):
            print(f"  [{i}/{len(migrations_needed)}] {sql.split('ADD COLUMN')[1].split()[0]}...")
            cursor.execute(sql)
        
        conn.commit()
        print(f"✅ Successfully added {len(migrations_needed)} columns to reels table")
        
        # Verify
        cursor.execute("SELECT COUNT(*) FROM reels WHERE frame_type = 'CENTER_STRIP'")
        count = cursor.fetchone()[0]
        print(f"✅ Migration verified: {count} reels now have default frame_type")
        
    except Exception as e:
        conn.rollback()
        print(f"❌ Migration failed: {str(e)}")
        sys.exit(1)
    
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()
