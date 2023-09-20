import { TaskRecursos } from '/imports/modules/toDos/config/recursos';

import { RoleType } from '/imports/seguranca/config/RoleType';

type MapRolesRecursos = {
    [key: string]: string[];
};

// @ts-ignore
function obterStringsEnum(enumValue: { [s: number]: string | number }): [string] {
    // @ts-ignore
    return Object.values(enumValue).filter((value) => typeof value === 'string');
}

/**
 * Mapeamento entre as roles (perfil de usuário) e os recursos.
 * chave: role.
 * valores: recursos.
 *
 *
 * O nome do recurso deve ser prefixado com nome do módulo.
 *
 * Favor manter a ordem alfabética no nome dos módulos.
 *
 */
export const mapRolesRecursos: MapRolesRecursos = {
    [RoleType.ADMINISTRADOR]: [
        TaskRecursos.VIEW,
        TaskRecursos.CREATE,
        TaskRecursos.EDIT,
        TaskRecursos.DELETE,
    ],
    [RoleType.USUARIO]: [
        TaskRecursos.VIEW,
        TaskRecursos.CREATE,
        TaskRecursos.EDIT,
        TaskRecursos.DELETE,
    ],
    [RoleType.PUBLICO]: [],
};
