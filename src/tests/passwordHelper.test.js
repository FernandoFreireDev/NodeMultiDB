const assert = require('assert');
const PasswordHelper = require('./../helpers/passwordHelper');
const SENHA = 'Fernando@12341243';
const HASH = '$2b$04$yNI5/M01.m2kuEX6X8PVrOyOuVnHkpi3NtLyipEh1G8H2H/TVtMkq';

describe.only('UserHelp Suite de Teste', function () {

    it('Deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA);
        
        assert.ok(result.length > 10);
    });

    it('Deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.compareAsync(SENHA, HASH);

        assert.ok(result);
    });

});