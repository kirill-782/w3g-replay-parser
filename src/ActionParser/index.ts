import { AbilityActionConverter } from "./AbilityAction";
import { AbilityTwoTargetTwoItemActionConverter } from "./AbilityTwoTargetTwoItemAction";
import {
  AbstractActionData,
  AbstractActionConverter,
} from "./AbstractActionData";
import { AllyOptionsConverter } from "./AllyOptionsAction";
import { ArrowKeyConverter } from "./ArrowKeyAction";
import { AssignGroupHotkeyConverter } from "./AssignGroupHotkeyAction";
import { CancelHeroRevivalConverter } from "./CancelHeroRevivalAction";
import { ChangeSelectionConverter } from "./ChangeSelectionAction";
import { ChatCommandConverter } from "./ChatCommandAction";
import { DecreaseSpeedConverter } from "./DecreaseSpeedAction";
import { ESCKeyEventConverter } from "./ESCKeyEventAction";
import { IncreaseSpeedConverter } from "./IncreaseSpeedAction";
import { ItemActionConverter } from "./ItemAction";
import { MinimapPingConverter } from "./MinimapPingAction";
import { OpenBuildSubmenuConverter } from "./OpenBuildSubmenuAction";
import { OpenSkillSubmenuConverter } from "./OpenSkillSubmenuAction";
import { PauseGameConverter } from "./PauseGameAction";
import { PositionAbilityActionConverter } from "./PositionAbilityAction";
import { PositionAndObjectAbilityActionConverter } from "./PositionAndObjectAbilityAction";
import { PreSubselectionConverter } from "./PreSubselectionAction";
import { RemoveQueuedUnitConverter } from "./RemoveQueuedUnitAction";
import { ResourceTransferConverter } from "./ResourceTransferAction";
import { ResumeGameConverter } from "./ResumeGameAction";
import { SaveGameConverter } from "./SaveGameAction";
import { SaveGameFinishedConverter } from "./SaveGameFinishedAction";
import { SelectGroudItemConverter } from "./SelectGroudItemAction";
import { SelectGroupHotkeyConverter } from "./SelectGroupHotkeyAction";
import { SelectSubGroupConverter } from "./SelectSubGroupAction";
import { SinglePlayerCheatConverter } from "./SinglePlayerCheatAction";
import { SinglePlayerCheatResourceConverter } from "./SinglePlayerCheatAction/SinglePlayerCheatResourceAction";
import { SinglePlayerCheatTimeConverter } from "./SinglePlayerCheatAction/SinglePlayerCheatTimeAction";
import { SyncIntegerConverter } from "./SyncIntegerAction";
import { Unknown1bConverter } from "./Unknown1bAction";
import { Unknown21Converter } from "./Unknown21Action";
import { Unknown62Converter } from "./Unknown62Action";
import { Unknown69Converter } from "./Unknown69Action";
import { Unknown6aConverter } from "./Unknown6aAction";
import { DataBuffer } from "../DataBuffer";

const DEFAULT_ACTION_HANDLERS: AbstractActionConverter[] = [];
DEFAULT_ACTION_HANDLERS[PauseGameConverter.type] = new PauseGameConverter();
DEFAULT_ACTION_HANDLERS[ResumeGameConverter.type] = new ResumeGameConverter();
DEFAULT_ACTION_HANDLERS[IncreaseSpeedConverter.type] =
  new IncreaseSpeedConverter();
DEFAULT_ACTION_HANDLERS[DecreaseSpeedConverter.type] =
  new DecreaseSpeedConverter();
DEFAULT_ACTION_HANDLERS[SaveGameConverter.type] = new SaveGameConverter();
DEFAULT_ACTION_HANDLERS[SaveGameFinishedConverter.type] =
  new SaveGameFinishedConverter();
DEFAULT_ACTION_HANDLERS[AbilityActionConverter.type] =
  new AbilityActionConverter();
DEFAULT_ACTION_HANDLERS[PositionAbilityActionConverter.type] =
  new PositionAbilityActionConverter();
DEFAULT_ACTION_HANDLERS[PositionAndObjectAbilityActionConverter.type] =
  new PositionAndObjectAbilityActionConverter();
DEFAULT_ACTION_HANDLERS[ItemActionConverter.type] = new ItemActionConverter();
DEFAULT_ACTION_HANDLERS[AbilityTwoTargetTwoItemActionConverter.type] =
  new AbilityTwoTargetTwoItemActionConverter();
DEFAULT_ACTION_HANDLERS[ChangeSelectionConverter.type] =
  new ChangeSelectionConverter();
DEFAULT_ACTION_HANDLERS[AssignGroupHotkeyConverter.type] =
  new AssignGroupHotkeyConverter();
DEFAULT_ACTION_HANDLERS[SelectGroupHotkeyConverter.type] =
  new SelectGroupHotkeyConverter();
DEFAULT_ACTION_HANDLERS[SelectSubGroupConverter.type] =
  new SelectSubGroupConverter();
DEFAULT_ACTION_HANDLERS[PreSubselectionConverter.type] =
  new PreSubselectionConverter();
DEFAULT_ACTION_HANDLERS[Unknown1bConverter.type] = new Unknown1bConverter();
DEFAULT_ACTION_HANDLERS[SelectGroudItemConverter.type] =
  new SelectGroudItemConverter();
DEFAULT_ACTION_HANDLERS[CancelHeroRevivalConverter.type] =
  new CancelHeroRevivalConverter();
DEFAULT_ACTION_HANDLERS[RemoveQueuedUnitConverter.type] =
  new RemoveQueuedUnitConverter();
DEFAULT_ACTION_HANDLERS[0x27] = new SinglePlayerCheatResourceConverter();
DEFAULT_ACTION_HANDLERS[Unknown21Converter.type] = new Unknown21Converter();
DEFAULT_ACTION_HANDLERS[0x28] = new SinglePlayerCheatResourceConverter();
DEFAULT_ACTION_HANDLERS[0x2d] = new SinglePlayerCheatResourceConverter();
DEFAULT_ACTION_HANDLERS[0x2e] = new SinglePlayerCheatTimeConverter();
DEFAULT_ACTION_HANDLERS[0x20] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x22] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x23] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x24] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x25] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x26] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x2a] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x2b] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x2c] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x2f] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x30] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x31] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[0x32] = new SinglePlayerCheatConverter();
DEFAULT_ACTION_HANDLERS[AllyOptionsConverter.type] = new AllyOptionsConverter();
DEFAULT_ACTION_HANDLERS[ResourceTransferConverter.type] =
  new ResourceTransferConverter();
DEFAULT_ACTION_HANDLERS[ChatCommandConverter.type] = new ChatCommandConverter();
DEFAULT_ACTION_HANDLERS[ESCKeyEventConverter.type] = new ESCKeyEventConverter();
DEFAULT_ACTION_HANDLERS[Unknown62Converter.type] = new Unknown62Converter();
DEFAULT_ACTION_HANDLERS[OpenSkillSubmenuConverter.type] =
  new OpenSkillSubmenuConverter();
DEFAULT_ACTION_HANDLERS[OpenBuildSubmenuConverter.type] =
  new OpenBuildSubmenuConverter();
DEFAULT_ACTION_HANDLERS[MinimapPingConverter.type] = new MinimapPingConverter();
DEFAULT_ACTION_HANDLERS[Unknown69Converter.type] = new Unknown69Converter();
DEFAULT_ACTION_HANDLERS[Unknown6aConverter.type] = new Unknown6aConverter();
DEFAULT_ACTION_HANDLERS[SyncIntegerConverter.type] = new SyncIntegerConverter();
DEFAULT_ACTION_HANDLERS[ArrowKeyConverter.type] = new ArrowKeyConverter();

export interface ActionCommandBlock {
  playerId: number;
  actions: AbstractActionData[];
  remaingBuffer: Uint8Array;
}

export class ActionParser {
  private actionHandlers: AbstractActionConverter[];

  constructor(actionHandler?: AbstractActionConverter[]) {
    this.actionHandlers = actionHandler
      ? [...DEFAULT_ACTION_HANDLERS, ...actionHandler]
      : DEFAULT_ACTION_HANDLERS;
  }

  // Action payload

  public parse(bytebuffer: DataBuffer): ActionCommandBlock[] {
    const actionBlocks: ActionCommandBlock[] = [];

    while (bytebuffer.remaining()) {
      const playerId = bytebuffer.readUint8();
      const actionsLength = bytebuffer.readUint16();
      const actions: AbstractActionData[] = [];

      const currentBlockEnd = bytebuffer.offset + actionsLength;

      while (bytebuffer.offset < currentBlockEnd) {
        const actionId = bytebuffer.readUint8();

        if (this.actionHandlers[actionId]) {
          const result = this.actionHandlers[actionId].parse(bytebuffer);

          if (result) {
            actions.push(result);
          } else {
            bytebuffer.offset--;
            break;
          }
        } else {
          bytebuffer.offset--;
          break;
        }
      }

      const remaingBuffer = bytebuffer
        .slice(bytebuffer.offset, currentBlockEnd)
        .toBuffer();
      bytebuffer.offset = currentBlockEnd;

      actionBlocks.push({
        playerId,
        actions,
        remaingBuffer,
      });
    }

    return actionBlocks;
  }

  public assembly(actions: ActionCommandBlock[]) {
    const commandBlocks = new Array<Uint8Array>();

    actions.forEach((i) => {
      const actions = new Array<Uint8Array>();

      i.actions.forEach((j) => {
        if (this.actionHandlers[j.type]) {
          const result = this.actionHandlers[j.type].assembly(j);

          if (result) actions.push(result);
        }
      });

      actions.push(i.remaingBuffer);

      const actionsData = actions.reduce((acc, curr) => {
        const temp = new Uint8Array(acc.length + curr.length);
        temp.set(acc, 0);
        temp.set(curr, acc.length);
        return temp;
      }, new Uint8Array(0));

      // Build header

      const header = new DataBuffer(3, true);
      header.writeUint8(i.playerId);
      header.writeUint16(actionsData.byteLength);

      commandBlocks.push(Uint8Array.of(...header.buffer, ...actionsData));
    });

    return commandBlocks.reduce((acc, curr) => {
      const temp = new Uint8Array(acc.length + curr.length);
      temp.set(acc, 0);
      temp.set(curr, acc.length);
      return temp;
    }, new Uint8Array(0));
  }
}
