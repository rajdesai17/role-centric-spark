const fs = require('fs');
const path = require('path');

// Files to update with their toast usage patterns
const filesToUpdate = [
  'src/pages/user/StoreExplorer.tsx',
  'src/pages/user/RatingDialog.tsx',
  'src/pages/UpdatePassword.tsx',
  'src/pages/store-owner/StoreOwnerDashboard.tsx',
  'src/pages/admin/UserManagement.tsx',
  'src/pages/admin/StoreManagement.tsx',
  'src/pages/admin/AdminDashboard.tsx',
  'src/pages/admin/AddUserForm.tsx',
  'src/pages/admin/AddStoreForm.tsx'
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import
    content = content.replace(
      /import \{ toast \} from "sonner";/g,
      'import { useNotification } from "@/components/ui/notification";'
    );
    
    // Add useNotification hook after other hooks
    if (content.includes('useNotification')) {
      // Find where to add the hook - after other useAuth or similar hooks
      const hookPattern = /const \{ [^}]+ \} = useAuth\(\);/;
      const match = content.match(hookPattern);
      if (match) {
        content = content.replace(
          match[0],
          match[0] + '\n  const { showNotification } = useNotification();'
        );
      }
    }
    
    // Replace toast calls
    content = content.replace(/toast\.success\(/g, 'showNotification(\'success\', ');
    content = content.replace(/toast\.error\(/g, 'showNotification(\'error\', ');
    content = content.replace(/toast\.info\(/g, 'showNotification(\'info\', ');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Update each file
filesToUpdate.forEach(updateFile);
console.log('Notification system update complete!'); 