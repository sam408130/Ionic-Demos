/**
* Ionic Calendar Languages
*
*/

var language = {

    d0: 'Sun',
    d1: 'Mon',
    d2: 'Tue',
    d3: 'Wed',
    d4: 'Thu',
    d5: 'Fri',
    d6: 'Sat',

    thisMonth: "Today",
    prevMonth: "<< Prev",
    nextMonth: "Next >>",

};

/**
 * Language settings
 *
 * @param lang
 * @returns {{month_labels: Array, dow_labels: Array}}
 */
var calendar_language = function(lang) {
    if (typeof(lang) == 'undefined' || lang === false) {
        lang = 'en';
    }

    switch (lang.toLowerCase()) {
        case 'de':
            return {
                month_labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                dow_labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
            };
            break;

        case 'en':
            return {
                month_labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                dow_labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            };
            break;

        case 'ar':
            return {
                month_labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
                dow_labels: ["أثنين", "ثلاثاء", "اربعاء", "خميس", "جمعه", "سبت", "أحد"]
            };
            break;

        case 'es':
            return {
                month_labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                dow_labels: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"]
            };
            break;

        case 'fr':
            return {
                month_labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                dow_labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
            };
            break;

        case 'it':
            return {
                month_labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
                dow_labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]
            };
            break;

        case 'nl':
            return {
                month_labels: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                dow_labels: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]
            };
            break;

        case 'pt':
            return {
                month_labels: ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                dow_labels: ["S", "T", "Q", "Q", "S", "S", "D"]
            };
            break;

        case 'ru':
            return {
                month_labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
                dow_labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вск"]
            };
            break;

        case 'se':
            return {
                month_labels: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
                dow_labels: ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"]
            };
            break;

        case 'bg':
            return {
                month_labels: ["Януари", "Февруари", "Март", "Април", "Май", "Юни", "Юли", "Август", "Септември", "Октомври", "Ноември", "Декември"],
                dow_labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нед"]
            };
            break;

        case 'tr':
            return {
                month_labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
                dow_labels: ["Pts", "Salı", "Çar", "Per", "Cuma", "Cts", "Paz"]
            };
            break;
    }

};

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];