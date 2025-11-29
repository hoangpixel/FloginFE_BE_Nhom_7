import { validateUsername, validatePassword } from '../utils/validation';

describe('Login Validation Tests - validateUsername', () => {
    test('TC1: Username rong - nen tra loi', () => {
        expect(validateUsername('')).toBe('username khong duoc de trong');
    });
    
    test('TC2: Username qua ngan - nen tra ve loi', () => {
        expect(validateUsername('ab')).toBe('username phai co it nhat 3 ky tu tro len');
    });

    test('TC3: Username qua dai - nen tra ve loi', () => {
        expect(validateUsername('aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff'))
        .toBe('username khong duoc vuot qua 50 ky tu');
    });

    test('TC4: Username chua ky tu dac biet - nen tra ve loi', () => {
        expect(validateUsername('user123!')).toBe('username khong duoc chua cac ky tu dac biet');
    });

    test('TC5: Username hop le - nen khong loi', () => {
        expect(validateUsername('user123')).toBe('');
    })

    test('TC6: Username hop le - nen khong loi', () => {
        expect(validateUsername('user-name-123')).toBe('');
    })

    test('TC7: Username hop le - nen khong loi', () => {
        expect(validateUsername('user.name.123')).toBe('');
    })
});

describe('Login Validation Tests - validatePassword', () => {
    test('TC1: Password rong - nen tra ve loi', () => {
        expect(validatePassword('')).toBe('password khong duoc de trong');
    });

    test('TC2: Password qua ngan - nen tra ve loi', () =>
    {
        expect(validatePassword('abcde')).toBe('password phai co it nhat 6 ky tu tro len');
    });

    test('TC3: Password qua dai - nen tra ve loi', () => 
    {
        expect(validatePassword('aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffaaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffaaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff'))
        .toBe('password khong duoc vuot qua 100 ky tu');
    });

    test('TC4: Password chi co so - nen tra ve loi', () =>
    {
        expect(validatePassword('123456')).toBe('password phai co ca chu lan so');
    });

    test('TC5: Password chi co chu - nen tra ve loi', () => 
    {
        expect(validatePassword('abcdef')).toBe('password phai co ca chu lan so');
    });

    test('TC6: Password hop le - nen khong loi', () => {
        expect(validatePassword('password123')).toBe('');
    });
});

