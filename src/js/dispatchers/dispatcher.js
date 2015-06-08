var Promise = require('es6-promise').Promise;
var assign = require('react/lib/Object.assign');

var _callbacks = [];
var _promises = [];

/**
 * �ݹ� ť�� �ݹ� �߰�
 * @param callback {function} ���� �����ϴ� �ݹ� �Լ�
 * @param payload {object} �׼ǿ��� �Ѿ�� ������
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
 * �ݹ� ť �ʱ�ȭ
 * @private
 */
var _clearPromise = function(){
    _promises = [];
};


var Dispatcher = function(){};
Dispatcher.prototype = assign(Dispatcher.prototype, {

    /**
     * ������� (�׼ǿ� ���ؼ� ȣ�����)�ݹ� ���
     * @param callback {function} ����� �ݹ� �Լ�
     * @returns {number} �ݹ� �迭�� �ε���
     */
    register : function(callback){
        _callbacks.push(callback);
        return _callbacks.length-1;
    },

    /**
     * ��� �ݹ� ����
     * @param payload {object} �׼ǿ��� �Ѿ�� ������
     */
    dispatch : function(payload){
        _callbacks.forEach(function(callback){
            _addPromise(callback, payload);
        });
        Promise.all(_promises).then(_clearPromise);
    }

});

module.exports = Dispatcher;
