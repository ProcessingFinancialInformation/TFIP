module TFIP.Web.UI.FileUploadModule {

    export interface IUploaderOptions {
        url: string;
        queueLimit?: number;
        headers?: any;
        onFileSuccess: (response, status, headers) => ng.IPromise<any>;
        onFileError: (response, status, headers) => ng.IPromise<any>;
        continueOnError: boolean;
    }

    export interface IFileUploadService {
        getUploader(): any;
        uploadAll(): void;
        uploadByFile(deferred?: ng.IDeferred<any>): ng.IPromise<any>;
        removeItemFromQueue(item: any): void;
        anyFilesToUpload(): boolean;
        initUploader(options: IUploaderOptions): void;
        destroyUploader(): void;
    }

    export class FileUploadService {

        public static $inject = [
            "httpWrapper",
            "FileUploader",
            "$q"
        ];

        private uploader: any;
        private onFileSuccess: (response, status, headers) => ng.IPromise<any>;
        private onFileError: (response, status, headers) => ng.IPromise<any>;
        private continueOnError: boolean;

        constructor(
            private httpWrapper: Core.ICustomHttpService,
            private FileUploader: any,
            private $q: ng.IQService) { }

        public initUploader(options: IUploaderOptions) {
            if (this.uploader === undefined || this.uploader === null) {
                this.uploader = new this.FileUploader();
            }

            this.uploader.withCredentials = true;
            this.uploader.removeAfterUpload = true;
            this.uploader.url = options.url;
            this.uploader.queueLimit = options.queueLimit || Number.MAX_VALUE;
            this.onFileSuccess = options.onFileSuccess;
            this.onFileError = options.onFileError;
            this.continueOnError = options.continueOnError;
        }

        public getUploader() {
            return this.uploader;
        }

        public removeItemFromQueue(item: any) {
            this.uploader.removeFromQueue(item);
        }

        public anyFilesToUpload(): boolean {
            return this.uploader.queue.length > 0;
        }

        public uploadAll() {
            this.uploader.uploadAll();
        }

        public uploadByFile(deferred?: ng.IDeferred<any>): ng.IPromise<any> {
            deferred = deferred || this.$q.defer();

            if (this.uploader.queue.length != 0) {
                var item = this.uploader.queue[0];
                item.onSuccess = (response, status, headers) => {
                    this.onFileSuccess(response, status, headers).then(() => {
                        this.uploadByFile(deferred);
                    });
                };
                item.onError = (response, status, headers) => {
                    this.onFileError(response, status, headers).then(() => {
                        if (this.continueOnError) {
                            this.uploadByFile(deferred);
                        } else {
                            deferred.reject();
                        }
                    });
                };
                item.upload();
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        }

        public destroyUploader() {
            this.uploader.destroy();
            this.uploader = undefined;
        }
    }
} 