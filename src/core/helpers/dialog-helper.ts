import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { AppInjectorService } from 'src/app/services/app-injector.service';

export class DialogHelper {
  public static async openDialog(title: string, content: string) {
    const dialog = AppInjectorService.injector.get(MatDialog);

    const dialogRef = dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title,
        content,
      },
    });

    return await firstValueFrom(dialogRef.beforeClosed()).then((e) => e);
  }
}
