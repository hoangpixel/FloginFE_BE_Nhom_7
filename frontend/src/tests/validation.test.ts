import { validateUsername, validatePassword } from '../lib/validation';

describe('Login Validation Tests - validateUsername', () => {
    test('TC1: Username rong - nen tra loi', () => {
        expect(validateUsername('')).toBe('username không được để trống');
    });
    
    test('TC2: Username qua ngan - nen tra ve loi', () => {
        expect(validateUsername('ab')).toBe('username phải có ít nhất 3 ký tự trở lên');
    });

    test('TC3: Username qua dai - nen tra ve loi', () => {
        expect(validateUsername('aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff'))
        .toBe('username không được vượt quá 50 ký tự');
    });

    test('TC4: Username chua ky tu dac biet - nen tra ve loi', () => {
        expect(validateUsername('user123!')).toBe('username không được chứa các ký tự đặc biệt');
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
        expect(validatePassword('')).toBe('password không được để trống');
    });

    test('TC2: Password qua ngan - nen tra ve loi', () =>
    {
        expect(validatePassword('abcde')).toBe('password phải có ít nhất 6 ký tự trở lên');
    });

    test('TC3: Password qua dai - nen tra ve loi', () => 
    {
        expect(validatePassword('aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffaaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffaaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff'))
        .toBe('password không được vượt quá 100 ký tự');
    });

    test('TC4: Password chi co so - nen tra ve loi', () =>
    {
        expect(validatePassword('123456')).toBe('password phải có cả chữ lẫn số');
    });

    test('TC5: Password chi co chu - nen tra ve loi', () => 
    {
        expect(validatePassword('abcdef')).toBe('password phải có cả chữ lẫn số');
    });

    test('TC6: Password hop le - nen khong loi', () => {
        expect(validatePassword('password123')).toBe('');
    })
    
});

