import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { VHttp } from './vhttp';
import { Headers } from '@angular/http';

export interface ChunkFileUploadProgres {
  uploaded: number;
  total: number;
}

@Injectable()
export class ChunkedFileUploadService {

  constructor(private vHttp: VHttp) { }

  public uploadFile(file: File, chunkSize, uploadHandler: string, workerThreads: number): Observable<any> {
    return this.createUploadRequest(file.name, uploadHandler)
      .switchMap(
        data => {
          const uploadId = data.uploadId;
          const uploadProgressSubject = new Subject<any>();
          const uploadTriggerSubject = new Subject<any>();

          const chunkList = this.getFileChunkArrayList(file, chunkSize);
          const totalChunkCount = chunkList.length;
          let uploadedChunkCount = 0;

          uploadTriggerSubject.asObservable().subscribe(
            c => {
              this.fileChunkReadAndUpload(file, uploadId, c.start, c.end).subscribe(
                data1 => {
                  uploadedChunkCount += 1;
                  uploadProgressSubject.next(c);

                  if (chunkList.length > 0) {
                    uploadTriggerSubject.next(chunkList.pop());
                  } else {
                    if (uploadedChunkCount === totalChunkCount) {
                      this.patchFileUploadRequestAsCompleted(uploadId).subscribe(
                        data2 => {
                          uploadTriggerSubject.complete();
                          uploadProgressSubject.complete();
                        },
                        error => {
                          uploadTriggerSubject.complete();
                          uploadProgressSubject.error(error);
                        }
                      );
                    }
                  }
                },
                error => {
                  uploadTriggerSubject.complete();
                  uploadProgressSubject.error(error);
                }
              );
            }
          );

          for (let i = 0; i < workerThreads; i++) {
            if (chunkList.length > 0) {
              uploadTriggerSubject.next(chunkList.pop());
            } else {
              break;
            }
          }
          return uploadProgressSubject.asObservable();
        }
      );
  }

  private getFileChunkArrayList(file: File, chunkSize): { start: number, end: number }[] {
    const chunkList = [];
    let offset = 0;
    do {
      chunkList.push({
        start: offset,
        end: Math.min(offset + chunkSize, file.size)
      });
      offset += chunkSize;
    } while (offset < file.size);
    return chunkList;
  }

  private patchFileUploadRequestAsCompleted(uploadId: string): Observable<any> {
    const url = `/lcm/gui/api/uploadFile/${uploadId}`;
    return this.vHttp.patch(url, { writeComplete: true });
  }

  private createUploadRequest(fileName: string, uploadHandler: string): Observable<{ uploadId: string }> {
    const url = '/lcm/gui/api/uploadFile';
    return this.vHttp.post(url, { fileName: fileName, uploadHandler: uploadHandler });
  }

  private uploadFileChunk(uploadId: string, start: number, end: number, fileSize: number, payLoad: any) {
    const url = `/lcm/gui/api/uploadFile/${uploadId}?chunkStart=${start}&chunkEnd=${end}`;
    const formData = new FormData();
    formData.append('file', payLoad);
    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    return this.vHttp.put(url, payLoad, { headers: headers });
  }

  private fileChunkReadAndUpload(file: File, uploadId: string, start: number, end: number): Observable<void | Error> {
    return this.uploadFileChunk(uploadId, start, end, file.size, file.slice(start, end));
  }
}
