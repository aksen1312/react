var Promise = require('es6-promise').Promise;
var assign = require('react/lib/Object.assign');

var _callbacks = [];
var _promises = [];

/**
 * 콜백 큐에 콜백 추가
 * @param callback {function} 스토어가 저장하는 콜백 함수
 * @param payload {object} 액션에서 넘어온 데이터
 * @private
 */
var _addPromise = function(callback, payload){
    _promises.push(new Promise(function(resolve, reject){
        if(callback(payload)){
            resolve(payload);
        }else{
            reject(new Error('Dispatcher callback unsuccessful'));
        }
    }));
};

/**
 * 콜백 큐 초기화
 * @private
 */
var _clearPromise = function(){
    _promises = [];
};


var Dispatcher = function(){};
Dispatcher.prototype = assign(Dispatcher.prototype, {

    /**
     * 스토어의 (액션에 의해서 호출당할)콜백 등록
     * @param callback {function} 등록할 콜백 함수
     * @returns {number} 콜백 배열의 인덱스
     */
    register : function(callback){
        _callbacks.push(callback);
        return _callbacks.length-1;
    },

    /**
     * 모든 콜백 실행
     * @param payload {object} 액션에서 넘어온 데이터
     */
    dispatch : function(payload){
        _callbacks.forEach(function(callback){
            _addPromise(callback, payload);
        });
        Promise.all(_promises).then(_clearPromise);
    }

});

module.exports = Dispatcher;
