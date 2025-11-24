import moment from 'moment';
const $ = window.$;

/**
 * Enhanced API call function with better error handling
 * @param {string} url - API endpoint (เช่น 'api/Machine/GetAllMachines')
 * @param {string} method - HTTP method (เช่น 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', ...)
 * @param {any} data - Request data (body) ถ้าเป็น GET/HEAD ให้ใส่ null
 * @param {function} successCallback - Success callback function
 * @param {function} errorCallback - Error callback function (optional)
 * @param {string} baseUrl - Base URL for API (optional, defaults to current host)
 */
export function CallWebAPI(
    url,
    method = 'GET',
    data = null,
    successCallback,
    errorCallback,
    baseUrl = ''
) {
    let auth = '';
    try {
        // Try multiple localStorage keys for auth token
        const userData = JSON.parse(localStorage.getItem('userdata') || '{}');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const crmAuthUser = JSON.parse(localStorage.getItem('crm-auth-user') || '{}');

        auth = userData.Token || user.token || crmAuthUser.token || '';
    } catch (e) {
        console.error('Error parsing userdata:', e);
    }

    const m = (method || 'GET').toUpperCase();

    // Construct full URL
    const fullUrl = baseUrl ? `${baseUrl}${url}` : url;

    const requestOptions = {
        method: m,
        body:
            m === 'GET' || m === 'HEAD'
                ? undefined
                : typeof data === 'string'
                ? data
                : JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': auth ? `Bearer ${auth}` : '',
        },
    };

    fetch(fullUrl, requestOptions)
        .then(async (res) => {
            if (!res.ok) {
                throw new Error(`Request ${fullUrl} failed with status ${res.status}`);
            }

            // Handle 204 No Content
            if (res.status === 204) {
                if (successCallback) successCallback({ success: true });
                return;
            }

            try {
                const text = await res.text();
                // If response is empty, return success object
                if (!text || text.trim() === '') {
                    if (successCallback) successCallback({ success: true });
                } else {
                    const result = JSON.parse(text);
                    if (successCallback) successCallback(result);
                }
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                if (errorCallback) errorCallback(false);
                else if (successCallback) successCallback(false);
            }
        })
        .catch((error) => {
            console.error('API call failed:', error);
            if (errorCallback) errorCallback(false);
            else if (successCallback) successCallback(false);
        });
}

/**
 * Modern async API call function
 * @param {string} url - API endpoint
 * @param {any} data - Request data
 * @param {string} method - HTTP method (เช่น 'GET', 'POST', 'PUT', 'DELETE', ...)
 * @param {string} type - Authorization type
 * @param {string} auth - Authorization token
 * @returns {Promise<any>} API response
 */
export async function CallApi(
    url,
    data,
    method = 'GET',
    type = 'Bearer',
    auth = ''
) {
    let token = auth;

    try {
        if (!token) {
            // Try multiple localStorage keys for auth token
            const userData = JSON.parse(localStorage.getItem('userdata') || '{}');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const crmAuthUser = JSON.parse(localStorage.getItem('crm-auth-user') || '{}');

            token = userData.Token || user.token || crmAuthUser.token || '';
        }
    } catch (e) {
        console.error('Error parsing userdata:', e);
    }

    const m = (method || 'GET').toUpperCase();

    try {
        const response = await fetch(url, {
            method: m,
            body: m === 'GET' || m === 'HEAD' ? undefined : JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': token ? `${type} ${token}` : '',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // ถ้า response ไม่มี content เลย
        const text = await response.text();
        if (!text || text.trim() === '') {
            return { success: true };
        }

        return JSON.parse(text);
    } catch (err) {
        console.error('API call failed:', err);
        return undefined;
    }
}

/**
 * Set cookie with enhanced security
 * @param {string} cname - Cookie name
 * @param {string} cvalue - Cookie value
 * @param {number} exdays - Expiration days
 */
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();

    // Encode value to prevent special character issues
    const encodedValue = encodeURIComponent(cvalue);

    // Set cookie with secure attributes
    document.cookie = `${cname}=${encodedValue}; ${expires}; path=/; SameSite=Lax`;
}

/**
 * Get cookie value with error handling
 * @param {string} cname - Cookie name
 * @returns {string} Cookie value
 */
export function getCookie(cname) {
    const name = cname + '=';
    const cookies = document.cookie.split(';');

    for (const c of cookies) {
        const trimmed = c.trimStart();
        if (trimmed.startsWith(name)) {
            try {
                return decodeURIComponent(trimmed.substring(name.length));
            } catch (e) {
                console.warn('Malformed cookie detected:', trimmed, e);
                return ''; // Return empty if decoding fails
            }
        }
    }
    return '';
}

/**
 * Format date to Thai locale string
 * @param {Date|string} date - Date to format
 * @param {string} fm - Format string (optional)
 * @returns {string} Formatted date string
 */
export function toDateString(date, fm) {
    if (!date) return '';

    if (fm === undefined) {
        return new Date(date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } else {
        const d = new Date(date);
        return fm
            .replace(/YYYY/g, d.getFullYear())
            .replace(/MM/g, String(d.getMonth() + 1).padStart(2, '0'))
            .replace(/DD/g, String(d.getDate()).padStart(2, '0'))
            .replace(/HH/g, String(d.getHours()).padStart(2, '0'))
            .replace(/mm/g, String(d.getMinutes()).padStart(2, '0'))
            .replace(/ss/g, String(d.getSeconds()).padStart(2, '0'));
    }
}

/**
 * Format date and time to Thai locale string
 * @param {Date|string} date - Date to format
 * @param {string} fm - Format string (optional)
 * @returns {string} Formatted date and time string
 */
export function toDateTimeString(date, fm) {
    if (!date) return '';

    if (fm === undefined) {
        const dateStr = new Date(date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
        const d = new Date(date);
        const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(
            d.getMinutes()
        ).padStart(2, '0')}`;
        return `${dateStr} ${timeStr}`;
    } else {
        const d = new Date(date);
        return fm
            .replace(/YYYY/g, d.getFullYear())
            .replace(/MM/g, String(d.getMonth() + 1).padStart(2, '0'))
            .replace(/DD/g, String(d.getDate()).padStart(2, '0'))
            .replace(/HH/g, String(d.getHours()).padStart(2, '0'))
            .replace(/mm/g, String(d.getMinutes()).padStart(2, '0'))
            .replace(/ss/g, String(d.getSeconds()).padStart(2, '0'));
    }
}

/**
 * Format time string
 * @param {Date|string} date - Date to format
 * @param {string} fm - Format string (optional)
 * @returns {string} Formatted time string
 */
export function toTimeString(date, fm) {
    if (!date) return '';

    if (fm === undefined) {
        const d = new Date(date);
        return `${String(d.getHours()).padStart(2, '0')}:${String(
            d.getMinutes()
        ).padStart(2, '0')}`;
    } else {
        const d = new Date(date);
        return fm
            .replace(/YYYY/g, d.getFullYear())
            .replace(/MM/g, String(d.getMonth() + 1).padStart(2, '0'))
            .replace(/DD/g, String(d.getDate()).padStart(2, '0'))
            .replace(/HH/g, String(d.getHours()).padStart(2, '0'))
            .replace(/mm/g, String(d.getMinutes()).padStart(2, '0'))
            .replace(/ss/g, String(d.getSeconds()).padStart(2, '0'));
    }
}

/**
 * Calculate age from birth year
 * @param {number} birthYear - Birth year
 * @returns {number} Age in years
 */
export function getAge(birthYear) {
    if (!birthYear) return 0;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return currentYear - birthYear;
}

function getAgeYMD(bdate, sdate) {
    if (!bdate) return;
    let dob = bdate;
    let age = '-';
    if (dob != null) {
        let getdayBirth = dob.split('-');
        let YB = parseInt(getdayBirth[0]);
        let MB = parseInt(getdayBirth[1]);
        let getday = getdayBirth[2].split('T');
        let DB = parseInt(getday[0]);
        let today = sdate ? new Date(sdate) : new Date(),
            result = {
                years: 0,
                months: 0,
                days: 0,
                toString: function () {
                    return (
                        (this.years ? this.years + ' ปี ' : '') +
                        (this.months ? this.months + ' เดือน ' : '') +
                        (this.days ? this.days + ' วัน' : '')
                    );
                },
            };
        result.months =
            today.getFullYear() * 12 +
            (today.getMonth() + 1) -
            (YB * 12 + MB);

        if (0 > (result.days = today.getDate() - DB)) {
            let y = today.getFullYear(),
                m = today.getMonth();
            m = --m < 0 ? 11 : m;
            result.days +=
                [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m] +
                ((1 == m &&
                    y % 4 == 0 &&
                    ((y % 100 > 0) || y % 400 == 0))
                    ? 1
                    : 0);
            --result.months;
        }
        result.years = (result.months - (result.months % 12)) / 12;
        result.months = result.months % 12;
        age =
            result.years +
            ' ปี ' +
            result.months +
            ' เดือน ' +
            result.days +
            ' วัน';
    }
    return age;
}

function getYearAge(bdate, sdate) {
    if (!bdate) return;
    let dob = bdate;
    let age = '-';
    if (dob != null) {
        let getdayBirth = dob.split('-');
        let YB = parseInt(getdayBirth[0]);
        let MB = parseInt(getdayBirth[1]);
        let getday = getdayBirth[2].split('T');
        let DB = parseInt(getday[0]);
        let today = sdate ? new Date(sdate) : new Date(),
            result = {
                years: 0,
                months: 0,
                days: 0,
                toString: function () {
                    return (
                        (this.years ? this.years + ' ปี ' : '') +
                        (this.months ? this.months + ' เดือน ' : '') +
                        (this.days ? this.days + ' วัน' : '')
                    );
                },
            };
        result.months =
            today.getFullYear() * 12 +
            (today.getMonth() + 1) -
            (YB * 12 + MB);

        if (0 > (result.days = today.getDate() - DB)) {
            let y = today.getFullYear(),
                m = today.getMonth();
            m = --m < 0 ? 11 : m;
            result.days +=
                [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m] +
                ((1 == m &&
                    y % 4 == 0 &&
                    ((y % 100 > 0) || y % 400 == 0))
                    ? 1
                    : 0);
            --result.months;
        }
        result.years = (result.months - (result.months % 12)) / 12;
        result.months = result.months % 12;
        age = result.years;
    }
    return age;
}

function getGender(gendere) {
    let str = '';
    if (gendere == 'M') {
        str = 'ชาย';
    } else if (gendere == 'F') {
        str = 'หญิง';
    } else {
        str = 'ไม่ระบุ';
    }
    return str;
}

function OpenLoading(id = '#mdw') {
    setTimeout(() => {
        $(id).modal();
    }, 200);
}

function CloseLoading(id = '#mdw') {
    setTimeout(() => {
        $(id).modal('hide');
    }, 200);
}

function CallConfirmBox(callback) {
    $('#mdMainConfirmSave .btn-primary').off('click');
    $('#mdMainConfirmSave').modal();
    $('#mdMainConfirmSave .btn-primary').click(function () {
        $('#mdMainConfirmSave').modal('hide');
        callback();
        $(this).off('click');
    });
}

let getBathText = function (inputNumber) {
    let getText = function (input) {
        let toNumber = input.toString();
        let numbers = toNumber.split('').reverse();

        let numberText =
            '/หนึ่ง/สอง/สาม/สี่/ห้า/หก/เจ็ด/แปด/เก้า/สิบ'.split('/');
        let unitText = '/สิบ/ร้อย/พ้น/หมื่น/แสน/ล้าน'.split('/');

        let output = '';
        for (let i = 0; i < numbers.length; i++) {
            let number = parseInt(numbers[i]);
            let text = numberText[number];
            let unit = unitText[i];

            if (number == 0) continue;

            if (i == 1 && number == 2) {
                output = 'ยี่สิบ' + output;
                continue;
            }

            if (i == 1 && number == 1) {
                output = 'สิบ' + output;
                continue;
            }

            output = text + unit + output;
        }

        return output;
    };

    let fullNumber = Math.floor(inputNumber);
    let decimal = inputNumber - fullNumber;

    if (decimal == 0) {
        return getText(fullNumber) + 'บาทถ้วน';
    } else {
        decimal = decimal * 100;
        decimal = Math.round(decimal);

        return getText(fullNumber) + 'บาท' + getText(decimal) + 'สตางค์';
    }
};

function openLoadingPage() {
    setTimeout(() => {
        $('#md_pageload').modal();
    }, 200);
}

function closeLoadingPage() {
    setTimeout(() => {
        $('#md_pageload').modal('hide');
    }, 200);
}

function openoverloadding(el) {
    let ld = `
<div id="loadoveride" style="background:rgba(52,58,64,.7)" class="w-100 h-100 position-absolute d-flex align-items-center text-center">
    <div class="w-100 text-center">
        <i class="fas fa-spinner fa-pulse fa-3x"></i>
        <p>Loading...</p>
    </div>
</div>
`;
    $(el).append(ld);
}

function closeoverloadding(el) {
    $(el).find('#loadoveride').remove();
}

/**
 * Get user permissions
 * @param {...string} name - Permission names to check
 * @returns {boolean|null} Permission status
 */
export function getpermission(...name) {
    if (name.length === 0) {
        return null;
    }

    try {
        const permissions = JSON.parse(
            localStorage.getItem('Permission') || '[]'
        );
        const found = permissions?.find((p) =>
            name.includes(p.Name.toLowerCase())
        );
        return found?.RID ? found.Correction : null;
    } catch (e) {
        console.error('Error parsing permissions:', e);
        return null;
    }
}

// Export all functions for ES6 modules
export default {
    CallWebAPI,
    CallApi,
    setCookie,
    getCookie,
    toDateString,
    toDateTimeString,
    toTimeString,
    getAge,
    getAgeYMD,
    getYearAge,
    getGender,
    OpenLoading,
    CloseLoading,
    CallConfirmBox,
    getBathText,
    openLoadingPage,
    closeLoadingPage,
    openoverloadding,
    closeoverloadding,
    getpermission,
};

// Also attach to window for backward compatibility
if (typeof window !== 'undefined') {
    window.CallWebAPI = CallWebAPI;
    window.CallApi = CallApi;
    window.setCookie = setCookie;
    window.getCookie = getCookie;
    window.toDateString = toDateString;
    window.toDateTimeString = toDateTimeString;
    window.toTimeString = toTimeString;
    window.getAge = getAge;
    window.getAgeYMD = getAgeYMD;
    window.getYearAge = getYearAge;
    window.getGender = getGender;
    window.OpenLoading = OpenLoading;
    window.CloseLoading = CloseLoading;
    window.CallConfirmBox = CallConfirmBox;
    window.getBathText = getBathText;
    window.openLoadingPage = openLoadingPage;
    window.closeLoadingPage = closeLoadingPage;
    window.openoverloadding = openoverloadding;
    window.closeoverloadding = closeoverloadding;
    window.getpermission = getpermission;
}
