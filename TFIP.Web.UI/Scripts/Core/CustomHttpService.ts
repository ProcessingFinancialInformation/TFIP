module TFIP.Web.UI.Core {

    export interface ICustomHttpService {
        get<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T>;
        del<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T>;
        head<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T>;
        jsonp<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T>;
        post<TData, TResult>(url: string, data: TData, requestConfig?: any, updateSession?: boolean): ng.IPromise<TResult>;
        put<TData, TResult>(url: string, data: TData, requestConfig?: any, updateSession?: boolean): ng.IPromise<TResult>;
        download(url: string): void;
        getFileUploaderParams(params: any): any
    }

    export interface IRejectionReason {
        aborted: boolean;
        message: string;
        code: number;
    }

    export class RejectionReason implements IRejectionReason {
        public aborted: boolean;
        public message: string;
        public code: HttpCodes;

        constructor(message: string, code: HttpCodes, aborted?: boolean) {
            this.message = message;
            this.code = code;
            this.aborted = aborted === true;
        }
    }

    export enum HttpCodes {
        Ok = 200,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        NotFound = 404,
        RequestTimeout = 408,
        LoginTimeout = 440,
    }

    export class CustomHttpService implements ICustomHttpService {

        public static $inject = [
            "$q",
            "$http",
            "$window"
        ];

        private deferredAbort: ng.IDeferred<any>;
        private aborted: boolean;
        private ignoreBeforeUnloadEvent: boolean;

        constructor(
            public $q: ng.IQService,
            public $http: ng.IHttpService,
            public $window: ng.IWindowService) {
            this.$http.defaults.headers.common = { 'Marvin-Token': this.$window.sessionStorage["marvinToken"] };
            this.reset();
            this.$window.onbeforeunload = (ev) => this.onBeforeUnload(ev);
        }

        public get<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T> {
            var promise = this.$http.get(url, this.changeRequestConfig(requestConfig));
            return this.process(url, promise, updateSession);
        }

        public del<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T> {
            var promise = this.$http["delete"](url, this.changeRequestConfig(requestConfig));
            return this.process(url, promise, updateSession);
        }

        public head<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T> {
            var promise = this.$http.head(url, this.changeRequestConfig(requestConfig));
            return this.process(url, promise, updateSession);
        }

        public jsonp<T>(url: string, requestConfig?: any, updateSession?: boolean): ng.IPromise<T> {
            var promise = this.$http.jsonp(url, this.changeRequestConfig(requestConfig));
            return this.process(url, promise, updateSession);
        }

        public post<TData, TResult>(url: string, data: TData, requestConfig?: any, updateSession?: boolean): ng.IPromise<TResult> {
            var promise = this.$http.post(url, data, this.changeRequestConfig(requestConfig));
            return this.process(url, promise, updateSession);
        }

        public put<TData, TResult>(url: string, data: TData, requestConfig?: any, updateSession?: boolean): ng.IPromise<TResult> {
            var promise = this.$http.put(url, data, this.changeRequestConfig(requestConfig));
            return this.process(url, promise, updateSession);
        }

        public download(url: string) {
            this.ignoreBeforeUnloadEvent = true;
            this.$window.location.href = url;
        }

        public getFileUploaderParams(params: any): any {

            if (!params) {
                params = {};
            }

            params.withCredentials = true;
            params.headers = { 'Marvin-Token': this.$window.sessionStorage["marvinToken"] };
            return params;
        }

        private onBeforeUnload(ev) {
            if (!this.ignoreBeforeUnloadEvent) {
                this.abortAll();
            }
            this.ignoreBeforeUnloadEvent = false;
        }

        private abortAll() {
            this.aborted = true;
            this.deferredAbort.resolve();
        }

        private reset() {
            this.deferredAbort = this.$q.defer();
            this.aborted = false;
            this.ignoreBeforeUnloadEvent = false;
        }

        private process<T>(url: string, promise: ng.IHttpPromise<T>, updateSession?: boolean): ng.IPromise<T> {

            var deferred = this.$q.defer<T>();

            promise.success((data: T) => {
                deferred.resolve(data);
            });

            promise.error((data: any, status: number, headers: (headerName: string) => string, config: ng.IRequestConfig) => {

                if (this.aborted) {
                    deferred.reject(new RejectionReason("Request was aborted.", status, true));
                    return;
                }
                
                // a temporary hardcoded solution. Should be refactored when API is moved to a separated service (application)
                var sessionExpired = (status === HttpCodes.BadRequest && data.message === "Session has expired.");
                var sessionExpiredTmg = (status === HttpCodes.LoginTimeout);
                var notAuthorized = status === HttpCodes.Unauthorized;
                
                // for the moment API can return only 200, 400 or 500 -- all other codes are system errors, etc
                // 200 -- OK (see success() handler), 400 -- validation errors, 500 -- server errors

                if (status === HttpCodes.BadRequest) {
                    if (data) {
                        if (data.message) {
                            deferred.reject(new RejectionReason(data.message, status));
                            return;
                        }
                    }
                }
                
                if (status === HttpCodes.NotFound) {
                    deferred.reject(new RejectionReason("Resource is not available.", status));
                }

                console.log("HTTP request failed.");
                data && console.log("data:", data.message);
                status && console.log("status:", status);
                config && console.log("url:", config.url);
                config && console.log("method:", config.method);

                deferred.reject(new RejectionReason("An error has occured. Please contact your system administrator.", status));
            });
            
            return deferred.promise;
        }

        private changeRequestConfig(requestConfig: any) {
            if (!requestConfig) {
                requestConfig = {
                    withCredentials: true
                };
            } else {
                if (!requestConfig.withCredentials || requestConfig.withCredentials === false) {
                    requestConfig.withCredentials = true;
                }
            };

            requestConfig.timeout = this.deferredAbort.promise;
            return requestConfig;
        }
    }

}